// 'use server'

import type { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import mongoose from 'mongoose'
import 'dotenv/config'
import { User } from '../../../models/User'
import { SignJWT } from 'jose'
import { sendMail } from '../../../lib/sendMail'
 
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

  // unverified email
  if(err.message === 'not verified'){
    errors.password = 'Please verify your email account.';
  }

  // bad verification token
  if(err.message === 'Incorrect verification token.'){
    errors.password = 'Incorrect verification token. If you requested a new verification link, this may be an older token.';
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
  console.log("got sent this error: ", err)
  return errors;
}



// var for token experation
    //  (JWT expects value in *seconds* - not ms like a cookie)
const maxAge: number = 1 * 24 * 60 * 60


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
  console.log('req body: ', body)
  const { email, password, isLogin, isSignup, isLogoff, userId, verificationToken, isVerify, isReverify } = body;

  // delete old versions of cookies
  console.log('authPost cookie was: ', cookies().get('authPost'));
  cookies().delete('jwt')
  cookies().delete('authPost')

  // confirm that req comes from one of the specific pages
  if (!isLogin && !isSignup && !isLogoff && !isVerify && !isReverify) return returnResponse(400, {error: 'Error. Where did this come from?'});

  
  // database connection
  const dbURI = process.env.MONGO_URI;
  mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log("db connection!"))
    .catch((err) => console.log(err));


  

  // 
  //    SIGN UP
  // 
  if(isSignup){
    console.log("within isSignup...")

    try{
      const user = await User.create({email, password});
      // const token = await createToken(user._id);
      const verificationLink = `http://localhost:3000/verification/${user.id}/${user.verificationToken}`;
      // cookies().set({
      //   name: 'jwt',
      //   value: token, 
      //   maxAge: maxAge*1000,
      //   sameSite: 'strict',
      //   secure: true,
      //   httpOnly: true
      // })
      // cookies().set({
      //   name: 'authPost',
      //   value: `just signed up with: ${email} ${password}`
      // })
      
      sendMail({
        to: `${email}`,
        from: '"Christopher Cook" <no-reply@verify.brainroot.tv>',
        subject: 'You just signed up for my dev site!',
        text: `Thank you! You just registered on my site using the following credentials. Email: ${email}, Password: ${password}`,
        html: `<h1>Thank you!</h1>
                <p>You just registered on my site using the following credentials.</p>
                <ul>
                  <li>Email: ${email}</li>
                  <li>Password: ${password}</li>
                </ul>
                <p>Please verify your account by clicking on the following link: ${verificationLink}
                </p>`
      })

      return returnResponse(201, { message: 'Sign-up successful. Please verify your email account.' })


    }
    catch(err){
      const errors = handleErrors(err);
      console.log("sign up errors: ", errors)
      
      return returnResponse(400, errors);
      // res.status(400).json({errors});
    }

  }


  // 
  //     LOG IN
  // 
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

 // 
  //     VERIFY
  // 
  if(isVerify && userId && verificationToken){
    
    console.log("within isVerify...")

    try {
      const user = await User.verify(userId, verificationToken);
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
        value: `just verified user: ${user.email}`
      })
      

      return returnResponse(201, {message: 'Successfully verified.', user: user._id});

    } catch(err) {
      const errors = handleErrors(err);
      console.log("verification errors: ", errors)
      
      return returnResponse(400, errors);
      // res.status(400).json({errors});
    }
  }

  // 
  //  RE-VERIFY
  // 
  if(isReverify && email){
    try {
      const user = await User.reverify(email);
      const verificationLink = `http://localhost:3000/verification/${user._id}/${user.verificationToken}`;

      sendMail({
        to: `${email}`,
        from: '"Christopher Cook" <no-reply@verify.brainroot.tv>',
        subject: 'You requested new verification for my dev site!',
        text: `Please verify your account by clicking on the following link: ${verificationLink}`,
        html: `<h1>Verify your account</h1>
                <p>You just requested a new account verification link from my dev website.</p>
                
                <p>You can verify your account by clicking on the following link: ${verificationLink}
                </p>`
      })

      return returnResponse(201, {message: 'Successfully resent.'});
    } 
    catch(err) {
      const errors = handleErrors(err);
      console.log("verification errors: ", errors)
      
      return returnResponse(400, errors);
      // res.status(400).json({errors});
    }
  }




}


