import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
// import 'dotenv/config'
// import jwt from 'jsonwebtoken'
import { jwtVerify } from 'jose'
import { verify } from 'crypto'

 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    // console.log("dashboard middleware test")

    const token = request.cookies.get('jwt')?.value

    if(!token){
        console.log('No JWT token found.');
        return NextResponse.redirect(new URL('/login', request.url))
    } else {
        
        // console.log('jwt token is: ', token)

        // check if token exists & is verified
        if(token){
            // console.log('made it in the middleware IF...')

            // jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            //     if(err){
            //         console.log(err.message);
            //         return NextResponse.redirect(new URL('/login', request.url))
            //     } else {
            //         console.log('decoded token: ', decodedToken);
            //         return NextResponse.next()
            //     }
            // })

            try {
                const verified = await jwtVerify(
                  token,
                  new TextEncoder().encode(process.env.JWT_SECRET)
                )
                // console.log('middleware verified = ', verified.payload.jti, verified.payload.jti.email, verified.payload.jti.info);
                return NextResponse.next()
              } catch (err) {
                console.log(err.message);
                
                const url = new URL('/login', request.url)
                
                // if request HAD a JWT, but it was expired, add 'expired' param
                if(err.message.includes('exp')){
                  console.log("The token has expired!")
                  url.searchParams.set("expired", "true")
                }

                const response = NextResponse.redirect(url)

                console.log("deleteing JWT cookie...")
                response.cookies.delete('jwt')
                response.cookies.delete('user')

                return response
                
              }

        }

    }
 
}
 
// Matching just Dashboard right now
export const config = {
  matcher: '/dashboard/:path*',
}