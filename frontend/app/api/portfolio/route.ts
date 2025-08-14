import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose'
import 'dotenv/config'

const getUrl = process.env.PORTFOLIO_GET_URL!;
const postUrl = process.env.PORTFOLIO_POST_URL!;

// JWT/admin validation
async function isValidJWT(token: string | undefined): boolean {

    var payload;
    try {
        const verified = await jwtVerify(
            token,
            new TextEncoder().encode(process.env.JWT_SECRET)
        )
        payload = verified ? verified.payload.jti : null
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
    return NextResponse.json(data, { status: res.status });
}


export async function POST(req: NextRequest) {

    const token = req.cookies.get('jwt')?.value

    // const authHeader = req.headers.get('authorization');
    // const token = authHeader?.split(' ')[1];

    if (!token || !isValidJWT(token)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // validate portfolio item...
    const payload = await req.json();
    console.log('api/portfolio payload = ', payload);

    // let { type, id, title, body, tags } = payload;
    // if (!type || !id || !title || !body || !tags ){
    //     return NextResponse.json({ error: 'Incomplete portfolio item.', payload: payload }, {status: 400});
    // }

    console.log('sending portfolio payload to Lambda...');
    const res = await fetch(postUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    

    const data = await res.json();
    
    if (!res.ok) console.log(data);

    return NextResponse.json(data, { status: res.status });
}