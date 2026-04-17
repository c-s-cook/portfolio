import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
// import 'dotenv/config'
// import jwt from 'jsonwebtoken'
import { jwtVerify } from 'jose'
// import { verify } from 'crypto'

 
// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
    

    // from attempting to move user data into headers...
    // not looping through effectively right now. Moving on... :S
    // const { pathname } = request.nextUrl;
    // if (!pathname.includes('dashboard')){
    //   console.log(pathname, ' is NOT /dashboard...');
    //   // if 'x-user' was already set, it should be auto-included, right?
    //   const requestHeaders = new Headers(request.headers);
    //   const userTest = requestHeaders.get('x-user') || 'nada';
    //   console.log('userTest: ', userTest);
    //   return NextResponse.next({
    //     request: {
    //       headers: requestHeaders
    //     }
    //   })
    // }
    // console.log('pathname: ', pathname);

    const token = request.cookies.get('jwt')?.value

    if(!token){
        console.log('No JWT token found.');
        return NextResponse.rewrite(new URL('/login', request.url))
    } else {

        // check if token exists & is verified
        if(token){

            try {
                const verified = await jwtVerify(
                  token,
                  new TextEncoder().encode(process.env.JWT_SECRET)
                )
                // console.log('middleware verified = ', verified.payload.jti, verified.payload.jti.email, verified.payload.jti.info);
                return NextResponse.next();

                // // attempting to jam user/admin info into the headers...
                // const requestHeaders = new Headers(request.headers);
                // requestHeaders.set("x-user", JSON.stringify({
                //   email: verified.payload.jti.email?.split('@')[0],
                //   admin: verified.payload.jti.admin || false
                // }));

                // console.log(requestHeaders.get('x-user'));

                // return NextResponse.next({
                //   request: {
                //     headers: requestHeaders
                //   }
                // })
              } catch (err) {
                console.log(err.message);
                
                const url = new URL('/login', request.url)
                
                // if request HAD a JWT, but it was expired, add 'expired' param
                if(err.message.includes('exp')){
                  console.log("The token has expired!")
                  url.searchParams.set("expired", "true")
                }

                const response = NextResponse.redirect(url)

                console.log("deleteing JWT cookie...");
                response.cookies.delete('jwt');
                response.cookies.delete('user');
                response.headers.delete('user');

                return response
                
              }

        }

    }
 
}
 
// Matching just Dashboard right now
export const config = {
  matcher: '/dashboard/:path*',
}