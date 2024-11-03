// 'use server'

import type { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import mongoose from 'mongoose'
import 'dotenv/config'
import { User } from '../../../models/User'
import { SignJWT } from 'jose'
 
type ResponseData = {
  message: string
}



//  handle errors
const handleErrors = (err) => {
  // console.log(err.message, err.code);
  let errors = {email: '', password: ''};

  // incorrect email
  if(err.message === 'incorrect email'){
    errors.email = 'That email is not yet registered';
  }

  // incorrect password
  if(err.message === 'incorrect password'){
    errors.password = 'Invalid password';
  }

  // duplicate error code
  if(err.code === 11000) {
    errors.email = 'That email is already registered.';
    return errors;
  }

  // validate errors
  if(err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({properties}) => {
      // console.log(properties);
      errors[properties.path] = properties.message;
    });

  }
  // catch all else
  console.log("got send this error: ", err)
  return errors;
}



// var for token experation
    //  (JWT expects value in *seconds* - not ms like a cookie)
const maxAge: number = 3 * 24 * 60 * 60


// creat JWT
const createToken = async (id) => {
  // arg1 = payload object
  // arg2 = secret for sig hash
  // arg3 = options obj
  
  // pkg: jsonwebtoken  doesn't work with nextjs's edge runtime constraints...?
  // return jwt.sign({ id }, process.env.JWT_SECRET, {
  //   expiresIn: maxAge
  // })

  const token:string = await new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setJti(id)
    .setIssuedAt()
    .setExpirationTime('2d')
    .sign(new TextEncoder().encode(process.env.JWT_SECRET))

  return token
}


// a reusable response function
const returnResponse = (statusCode: number = 400, payload: Object, headers?: JSON) => {
  console.log('was give this to respond: ', statusCode, payload)
  return Response.json(payload, {
    status: statusCode
  })
}





// basic GET response - just testing for now
export async function GET(req: NextApiRequest) {

  const message = cookies().has('jwt') ? "You've successfully logged out." : "You aren't logged in."

  cookies().delete('jwt')
  cookies().delete('authPost')

  return returnResponse(200, {message: message})
}




/**
 * 
 * @param request 
 * @returns 
 */


export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const body = await req.json()
  const { email, password, isLogin, isSignup, isLogoff } = body;

  // confirm that req comes from one of the specific pages
  if (!isLogin && !isSignup && !isLogoff) return Response.status(400);

  
  // database connection
  console.log("attemtping new db connection...")
  const dbURI = process.env.MONGO_URI;
  mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log("db connection!"))
    .catch((err) => console.log(err));

  console.log('authPost cookie was: ', cookies().get('authPost'));
  cookies().delete('jwt')
  cookies().delete('authPost')


  // SIGN UP
  if(isSignup){
    console.log("within isSignup...")

    try{
      const user = await User.create({email, password});
      const token = await createToken(user._id);
      cookies().set({
        name: 'jwt',
        value: token, 
        maxAge: maxAge*1000,
        sameSite: 'strict',
        secure: true,
        httpOnly: true
      })
      cookies().set({
        name: 'authPost',
        value: `just signed up with: ${email} ${password}`
      })
      // res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge*1000 });
      // res.status(201).json({ user: user._id });
      return returnResponse(201, { user: user._id })
      // return Response.json({ user: user._id }, {
      //   status: 201,
      //   headers: {
      //     // 'Set-Cookie': 'jwtInLine=DidItWork22?2; Path=/'
      //   }
      // })

    }
    catch(err){
      const errors = handleErrors(err);
      console.log("sign up errors: ", errors)
      
      return returnResponse(400, errors);
      // res.status(400).json({errors});
    }

  }


  // LOG IN
  if(isLogin){
    console.log("within isLogin...")

    try{
      const user = await User.login(email, password);
      const token = await createToken(user._id);
      cookies().set({
        name: 'jwt',
        value: token, 
        maxAge: maxAge*1000,
        sameSite: 'strict',
        secure: true,
        httpOnly: true
      })
      cookies().set({
        name: 'authPost',
        value: `just logged in with: ${email} ${password}`
      })

      return returnResponse(201, { user: user._id })

      // res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge*1000 });
      // res.status(200).json({ user: user._id });

    } catch(err) {
      const errors = handleErrors(err);
      console.log("log in errors: ", errors)
      
      return returnResponse(400, errors);
      // res.status(400).json({errors});
    }
  }






  // return Response.json(body, {
  //   status: 200,
  //   headers: {
  //     'Set-Cookie': 'jwtInLine=DidItWork22?2; Path=/'
  //   }
  // })
}


