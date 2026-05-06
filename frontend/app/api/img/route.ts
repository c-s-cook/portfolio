
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose'


// JWT/admin validation
async function isValidJWT(token: string | undefined): Promise<any> {

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

    let test = req.headers.get('x-csc-test');
    console.log('right test??? > ', test);

    if (!payload && !test) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    } else if (!test&& !payload.admin) {
        // assume non-admin user is using DEMO MODE
        // send back a note to use BLOB URL for local use

        console.log("DEMO MODE - sending BLOB URL...");

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
        var imgUrl = `${process.env.NEXT_PUBLIC_IMG_BUCKET_CDN}/${imageFile.name}`;
        var thumb = `${process.env.NEXT_PUBLIC_IMG_BUCKET_CDN}/${imageFile.name.replace(/\.(jpg|jpeg|png)$/i, "_thumbnail.jpg")}`;

        console.log('attempting to upload: ', imageFile.name);

        // Send the image to AWS S3 API...
        var response = await fetch(imgApi, {
            method: 'PUT',
            body: imageFile,
            headers: {
                'Content-Type': imageFile.type,
                'Authorization': process.env.S3_IMG_BUCKET_API_AUTH
            }
        })



        if (!response.ok) {
            let data = await response.json();

            console.log('error: ', data);

            return new Response(JSON.stringify({ error: data }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                }
            })
        } else {

            console.log('Image uploaded. Beginning accessibility checks...');
            // pause for processing, then test the thumb URL (which would be the last processed)...
            let testCount = 0;
            let maxTests = 6;
            let imgAccessible = false;

            // initial pause...
            await new Promise(resolve => setTimeout(resolve, 2000));    

            // test...
            let testImgUrl = async () => {
                try {
                    var testResponse = await fetch(thumb, {
                        method: 'HEAD'
                    })

                    if (testResponse.ok) {
                        imgAccessible = true;
                        console.log('Processed thumbnail is accessible!');
                    } else {
                        // console.log('Image not accessible yet, retrying...');
                        testCount++;
                        if (testCount < maxTests) {
                            await new Promise(resolve => setTimeout(resolve, 1000));
                            await testImgUrl();
                        } else {
                            console.log('Max retries reached. Image is still not accessible.');
                            throw new Error('Image uploaded, but is not accessible after max retry attempts.');
                        }
                    }
                }
                catch (error) {
                    throw error;
                }
            }
            await testImgUrl();

            console.log('Image upload and processing complete. Returning response...');
            return new Response(JSON.stringify({
                success: 'Image uploaded!',
                URL: imgUrl,
                thumb: thumb
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