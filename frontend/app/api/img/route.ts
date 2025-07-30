
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    console.log("IMG API: You Called?");
    try {
        // Parse FormData...
        const formData = await req.formData();
        // Get img file...
        const imageFile = formData.get('imageFile') as File;

        // validate image file...
        if (!imageFile || !(imageFile instanceof Blob)) {
            console.log("failed to validate image...");
            return new Response(JSON.stringify({ error: 'No image file provided.' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        } else {
            console.log("working with...", imageFile.name);
        }

        
        // concat the API end-point for S3 upload...
        const imgApi = `${process.env.S3_IMG_BUCKET_API}${imageFile.name}`;
        
        // concat the expected img file path after a successfull upload...
        const imgUrl = `${process.env.S3_IMG_BUCKET}${imageFile.name}`;


        console.log('attempting to upload: ', imageFile.name);

        // Send the image to AWS S3 API...
        const response = await fetch(imgApi, {
            method: 'PUT',
            body: imageFile,
            headers: {
                'Content-Type': imageFile.type
            }
        })

        console.log('made it here...');

        if (!response.ok){
            let data = await response.json();

            console.log('error: ', data);

            return new Response(JSON.stringify({ error: data }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        } else {

            return new Response(JSON.stringify({ 
                success: 'Image uploaded!',
                URL: imgUrl,
            }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }





    } catch(error) {
        console.log("error! -> ", error);
        return new Response(JSON.stringify({ error: error }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        })

    }
}