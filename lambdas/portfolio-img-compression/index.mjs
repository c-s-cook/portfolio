// if png/jpg uploaded to s3 bucket, compress and create thumbnail

import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export const handler = async (event) => {
    const getBucket = event.Records[0].s3.bucket.name;
    const putBucket = process.env.PUT_BUCKET_NAME;
    const key = event.Records[0].s3.object.key;

    console.log(`Processing image: ${key} from bucket: ${getBucket}`);

    // fetch the image...
    const getObjectCommand = new GetObjectCommand({ Bucket: getBucket, Key: key });
    const { Body } = await s3.send(getObjectCommand);
    if (!Body) throw new Error("No image found");
    
    // convert to buffer...
    const byteArray = await Body.transformToByteArray();
    if (!byteArray) throw new Error("No byteArray...");
    const buffer = Buffer.from(byteArray);

    // feed it into sharp | check image and resize if needed...
    // const image = await sharp(Body); // --->> needs to be a buffer, *not* the Body...
    const image = await sharp(buffer);
    const metadata = await image.metadata();

    if (metadata.format !== "jpeg" && metadata.format !== "png") {
        throw new Error("Unsupported image format");
    }

    if (!metadata.size || !metadata.width || !metadata.height) {
        throw new Error("Missing image metadata");
    }

    const originalSize = metadata.size;
    const originalWidth = metadata.width;
    const originalHeight = metadata.height;

    console.log(`Original image size: ${originalSize} bytes, dimensions: ${originalWidth}x${originalHeight}`);
    console.log(`Image format: ${metadata.format}`);

    // If the image is too big (size or dimensions)...
    if (originalSize > 1024 * 1024 || originalWidth > 1200 || originalHeight > 1200) {
        if (originalWidth > 1200 || originalHeight > 1200) {
            await image.resize({ width: 1200, height: 1200, fit: "inside" });
        }

        if (metadata.size > 1024 * 1024 && metadata.format === "jpeg") {
            await image.jpeg({ quality: 80 });
        }

        if (metadata.size > 1024 * 1024 && metadata.format === "png") {
            await image.png({ compressionLevel: 9 });
        }

    }

    // save image to new bucket...
    const compressedImageBuffer = await image.withMetadata().toBuffer();

    const putObjectCommand = new PutObjectCommand({
        Bucket: putBucket,
        Key: key,
        Body: compressedImageBuffer,
    });


    const result = await s3.send(putObjectCommand);
    if (result) {
        console.log(`Successfully uploaded compressed image: ${key} to bucket: ${putBucket}. Moving on to Thumbnail...`);
    } else {
        throw new Error(`Failed to upload compressed image: ${key} to bucket: ${putBucket}. Result: ${JSON.stringify(result)}`);
    }

    // now for the thumbnail...
    const thumbnailBuffer = await image.resize({ width: 250, height: 250, fit: "cover" }).jpeg({ quality: 70 }).withMetadata().toBuffer();

    const thumbnailKey = key.replace(/\.(jpg|jpeg|png)$/i, "_thumbnail.jpg");   //  really need the 'i' flag here to catch uppercase extensions...
                                                                                // otherwise the thumbnail will overwrite the initial compressed JPG / JPEG / PNG images in the new bucket...
    const putThumbnailCommand = new PutObjectCommand({
        Bucket: putBucket,
        Key: thumbnailKey,
        Body: thumbnailBuffer,
    });

    const thumbnailResult = await s3.send(putThumbnailCommand);
    if (!thumbnailResult) {
        throw new Error(`Failed to upload thumbnail: ${thumbnailKey} to bucket: ${putBucket}. Result: ${JSON.stringify(thumbnailResult)}`);
    }
};