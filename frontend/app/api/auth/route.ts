// 'use server'

import type { NextApiRequest } from 'next'
import { cookies } from 'next/headers'
import mongoose from 'mongoose'
import 'dotenv/config'
import { User } from '../../../models/User'
import { SignJWT } from 'jose'
import { sendMail } from '../../../lib/sendMail'
import type { AuthType } from '../../../lib/types'

type ResponseData = {
  message: string
}



//  handle errors
const handleErrors = (err) => {
  // console.log(err.message, err.code);
  let errors = { email: '', password: '', code: null };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not yet registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'Invalid password';
  }

  // unverified email
  if (err.message === 'not verified') {
    errors.password = 'Please verify your email account.';
  }

  // bad verification token
  if (err.message === 'Incorrect verification token.') {
    errors.password = 'Incorrect verification token. If you requested a new verification link, this may be an older token.';
  }

  // duplicate error code
  if (err.code === 11000) {
    errors.email = 'That email is already registered.';
    errors.code = 11000;
    return errors;
  }

  // validate errors
  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(properties);
      errors[properties.path] = properties.message;
    });

  }
  // catch all else
  console.log("got sent this error: ", err)
  return errors;
}



// var for token experation
//  - (JWT expects value in *seconds* - not ms like a cookie)
const maxAge: number = 1 * 24 * 60 * 60



// creat JWT
const createToken = async (id) => {

  const expire = process.env.ENVIRONMENT == 'DEV' ? '80 min' : '20 min';

  const token: string = await new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setJti(id)
    .setIssuedAt()
    .setExpirationTime(expire)
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





//
//  SIGN-UP
// 
const isSignup = async (email: string, password: string) => {
  try {
    const user = await User.create({ email, password });
    const verificationLink = `http://localhost:3000/verification/${user.id}/${user.verificationToken}`;

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
  catch (err) {
    const errors = handleErrors(err);
    console.log("sign up errors: ", errors)

    return returnResponse(400, errors);
  }
}



//
//  LOG-IN 
// 
const isLogin = async (email: string, password: string) => {
  try {
    const user = await User.login(email, password);

    let jwtUserInfo = {
      _id: user._id,
      email: email,
      admin: process.env.ENVIRONMENT == 'DEV' ? true : false
    }
    if (user.admin) jwtUserInfo['admin'] = user.admin;

    const token = await createToken(jwtUserInfo);
    cookies().set({
      name: 'jwt',
      value: token,
      maxAge: maxAge * 1000,
      sameSite: 'strict',
      secure: true,
      httpOnly: true
    })

    return returnResponse(201, { user: user._id })
  }
  catch (err) {
    const errors = handleErrors(err);
    console.log("log in errors: ", errors)

    return returnResponse(400, errors);
  }
}



// 
//  LOG-OUT
// 
const isLogout = async () => {
  const message = cookies().has('jwt') ? "You've successfully logged out." : "You aren't logged in."

  cookies().delete('jwt')
  cookies().delete('authPost')

  return returnResponse(200, { message: message })
}



// 
//  VERIFY
// 
const isVerify = async (userId: string, verificationToken: string) => {
  try {
    const user = await User.verify(userId, verificationToken);
    const token = await createToken(user._id);
    cookies().set({
      name: 'jwt',
      value: token,
      maxAge: maxAge * 1000,
      sameSite: 'strict',
      secure: true,
      httpOnly: true
    })

    return returnResponse(201, { message: 'Successfully verified.', user: user._id });

  } catch (err) {
    const errors = handleErrors(err);
    console.log("verification errors: ", errors)

    return returnResponse(400, errors);
  }
}



// 
//  RE-VERIFY
// 
const isReverify = async (email: string) => {
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

    return returnResponse(201, { message: 'Successfully resent.' });
  }
  catch (err) {
    const errors = handleErrors(err);
    console.log("re-verification errors: ", errors)

    return returnResponse(400, errors);
  }
}



// 
//  REQUEST RESET
// 
const isResetRequest = async (email: string) => {
  try {
    const user = await User.resetRequest(email);
    const verificationLink = `http://localhost:3000/reset/${user._id}/${user.resetToken}/${user.resetTime.getTime()}`;

    sendMail({
      to: `${email}`,
      from: '"Christopher Cook" <no-reply@verify.brainroot.tv>',
      subject: 'Password Reset Request for my dev site!',
      text: `To reset your password, please click the following link: ${verificationLink}`,
      html: `<h1>Password Reset</h1>
              <p>A request was made to reset your account password.</p>
              
              <p>You can reset your password by clicking on the following link: ${verificationLink}
              </p>
              
              <p>If you did not request to reset your password, or are now having serious regrets about initiating this process, please ingore this email.</p>
              `
    })

    return returnResponse(201, { message: 'Reset link successfully sent.' });
  }
  catch (err) {
    const errors = handleErrors(err);
    console.log("password reset errors: ", errors)

    return returnResponse(400, errors);
  }
}


// 
//  RESET CHECK
// 
const isResetCheck = async (userId: string, resetToken: string, resetTime: Date) => {

  if (Date.now() > resetTime.getTime()) throw Error('The link has expired.')

  try {
    const user = await User.resetCheck(userId, resetToken);
    return returnResponse(201, { message: 'Reset link is valid.' });
  }
  catch (err) {
    const errors = handleErrors(err);
    console.log("password reset errors: ", errors)

    return returnResponse(400, errors);
  }
}


// 
//  RESET PASSWORD
// 
const isReset = async (userId: string, password: string, resetToken: string, resetTime: Date) => {

  if (Date.now() > resetTime.getTime()) throw Error('The link has expired.')

  try {
    const user = await User.resetPassword(userId, password, resetToken);

    return returnResponse(201, { message: 'Password reset.' });
  }
  catch (err) {
    const errors = handleErrors(err);
    console.log("password reset errors: ", errors)

    return returnResponse(400, errors);
  }
}











// 
// basic GET response - just testing for now
// 
export async function GET(req: NextApiRequest) {

  const message = "Whatcha trying to do here, huh?"

  cookies().delete('jwt')
  cookies().delete('authPost')

  return returnResponse(400, { message: message })
}



/** 
 *****  API POST  ******
 * 
 * Primary API endpoint for authentication via /login, /signup, /logout, and /[verification]
 * 
 * @param   { NextApiRequest }  req   req body must contain an .authType property of type:AuthType
 * @returns { Response }
 */


export async function POST(req: NextApiRequest) {

  const body = await req.json()

  const { email, password, userId, verificationToken, resetToken, resetTime, resetCheck } = body;
  const authType: AuthType = body.authType;


  // delete old versions of cookies
  cookies().delete('jwt')
  cookies().delete('authPost')


  // confirm that req comes from one of the specific pages
  if (!authType) return returnResponse(400, { error: 'Error. Where did this come from?' });


  // database connection
  const dbURI = process.env.MONGO_URI;
  mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log("db connection!"))
    .catch((err) => console.log(err));

  //  call auth logic based on authType
  switch (authType) {
    case "SIGN-UP":
      return await isSignup(email, password);

    case "LOG-IN":
      return await isLogin(email, password);

    case "LOG-OFF":
      return await isLogout();

    case "VERIFY":
      return await isVerify(userId, verificationToken);

    case "RE-VERIFY":
      return await isReverify(email);

    case "REQUEST-RESET":
      return await isResetRequest(email);

    case "RESET":
      if (resetCheck) return await isResetCheck(userId, resetToken, resetTime);
      else return await isReset(userId, password, resetToken, resetTime);

    default:
      return returnResponse(400, { error: 'Error. Should not have made it this far in the switch stmt...' });

  }
}


