
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose'


// JWT/admin validation
async function isValidJWT(token: string | undefined): JSON {

    var payload;
    try {
        const verified = await jwtVerify(
            token,
            new TextEncoder().encode(process.env.JWT_SECRET)
        )
        payload = verified ? verified.payload.jti : null
        console.log('jwt payload:', payload);
        console.log('jwt admin?:', payload.admin);

        return payload;

    } catch (err) {
        console.log('jwt error!')
        return null
    }
}


export async function POST(req: NextRequest) {
    console.log("IMG API: You Called?");


    const token = req.cookies.get('jwt')?.value
    const payload = await isValidJWT(token);
    console.log('API portfolio POST isAdmin:', payload);
    let sendBlob: boolean = false;

    if (!payload) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    } else if (!payload.admin) {
        // assume non-admin user is using DEMO MODE
        // send back a note to use BLOB URL for local use

        return new Response(JSON.stringify({
            success: 'Image should be BLOBBED for local use!',
            URL: 'blob'
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        })

        // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }




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
        var imgUrl = `${process.env.S3_IMG_BUCKET}${imageFile.name}`;

        console.log('attempting to upload: ', imageFile.name);

        // Send the image to AWS S3 API...
        var response = await fetch(imgApi, {
            method: 'PUT',
            body: imageFile,
            headers: {
                'Content-Type': imageFile.type
            }
        })



        if (!response.ok) {
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





    } catch (error) {
        console.log("error! -> ", error);
        return new Response(JSON.stringify({ error: error }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        })

    }
}