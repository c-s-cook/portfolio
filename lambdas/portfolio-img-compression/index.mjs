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
    const compressedImageBuffer = await image.toBuffer();

    const putObjectCommand = new PutObjectCommand({
        Bucket: putBucket,
        Key: key,
        Body: compressedImageBuffer,
    });

    await s3.send(putObjectCommand);

    // now for the thumbnail...
    const thumbnailBuffer = await image.resize({ width: 150, height: 150, fit: "cover" }).jpeg({ quality: 80 }).toBuffer();

    const thumbnailKey = key.replace(/\.(jpg|jpeg|png)$/, "_thumbnail.jpg");
    const putThumbnailCommand = new PutObjectCommand({
        Bucket: putBucket,
        Key: thumbnailKey,
        Body: thumbnailBuffer,
    });

    await s3.send(putThumbnailCommand);
};