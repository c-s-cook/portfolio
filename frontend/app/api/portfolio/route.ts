import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose'
import 'dotenv/config'
import { set } from 'mongoose';

const getUrl = process.env.PORTFOLIO_GET_URL!;
const postUrl = process.env.PORTFOLIO_POST_URL!;

// JWT/admin validation
async function isValidJWT(token: string | undefined): Promise<boolean> {

    var payload;
    try {
        const verified = await jwtVerify(
            token,
            new TextEncoder().encode(process.env.JWT_SECRET)
        )
        payload = verified ? verified.payload.jti : null
        // console.log('jwt payload:', payload);
        // console.log('jwt admin?:', payload.admin);
    } catch (err) {
        console.log('jwt error!')
    }

    return payload && payload.admin ? true : false;
}


export async function GET(req: NextRequest) {

    // const token = req.cookies.get('jwt')?.value;
    // if (token) isValidJWT(token);
    // else console.log("no token!");

    const res = await fetch(getUrl);
    const data = await res.json();
    // 5-second delay
    await new Promise(resolve => setTimeout(resolve, 5000));
    return NextResponse.json(data, { status: res.status });
}


export async function POST(req: NextRequest) {

    console.log('API portfolio POST called');
    const token = req.cookies.get('jwt')?.value
    const isAdmin = await isValidJWT(token);
    console.log('API portfolio POST isAdmin:', isAdmin);

    // const authHeader = req.headers.get('authorization');
    // const token = authHeader?.split(' ')[1];

    if (!token) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    } else if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const actionType = req.headers.get('Action-Type');
    // get the headers from the request
    // const headers = req.headers;
    // console.log('API portfolio POST headers = ', headers);

    console.log('API portfolio POST actionType = ', actionType);

    if (!actionType || (actionType !== 'add' && actionType !== 'edit')) {
        return NextResponse.json({ error: 'Invalid Action-Type' }, { status: 400 });
    }

    // validate portfolio item...
    const payload = await req.json();
    console.log('api/portfolio payload = ', payload.title);

    // let { type, id, title, body, tags } = payload;
    // if (!type || !id || !title || !body || !tags ){
    //     return NextResponse.json({ error: 'Incomplete portfolio item.', payload: payload }, {status: 400});
    // }

    console.log('sending portfolio payload to Lambda...');
    const res = await fetch(postUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Action-Type': actionType
        },
        body: JSON.stringify(payload),
    });


    if (!res.ok) {
        if (res.json) {
            const errorData = await res.json();
            console.log('Error response from Lambda:', errorData);
            return NextResponse.json({ error: 'Error from Lambda', details: errorData }, { status: res.status });
        } else {
            console.log('Error response from Lambda with no JSON body');
            return NextResponse.json({ error: 'Error from Lambda with no details' }, { status: res.status });
        }
    }
    else {
        const data = await res.json();
        
        return NextResponse.json(data, { status: res.status });
        
    }

}