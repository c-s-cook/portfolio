"use client"

import { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { AuthType } from '../../../lib/types'

import '../authForms.css'
import { error } from 'console'

export default function SignupPage() {
  const router = useRouter()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const form = document.getElementById('signup-form')
    const email = formData.get('email')
    const password = formData.get('password')
    const authType: AuthType = "SIGN-UP"

    const errorMsg = document.getElementById('error-msg');
    errorMsg.innerText = '';

    const errorMsgIsRegistered = document.getElementById('signup-err-isRegistered') as HTMLBodyElement;
    errorMsgIsRegistered.style.display = 'none';


    const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;
    submitBtn.disabled = true;
    submitBtn.textContent = 'SENDING...'
    submitBtn.classList.add('disabled')


    const response = await fetch('./api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, authType }),
    })

    if (response.status == 201) {

      const successMsg = document.getElementById('success-msg');
      form.classList.add('disable')
      form.style.display = 'none'
      successMsg.style.display = 'block';
      successMsg.textContent = `Thank you for signing up. I've sent an email to ${email} with a link to verify your email address and activate your account.`

    } else {
      // Handle errors

      let err = await response.json()
      if (err.code === 11000) {
        errorMsgIsRegistered.style.display = 'block';
      }
      else {
        errorMsg.textContent = err.email + err.password;
        errorMsg.style.display = 'block';
      }
      submitBtn.disabled = false;
      submitBtn.textContent = "Sign up"
    }
  }

  return (
    <>
      <section className='full'>
        <div className="content auth with-background bg-grad">

          <form id='signup-form' onSubmit={handleSubmit} className='auth'>

            <h3>Sign Up:</h3>

            <label htmlFor="email">Email:</label>
            <input type="email" name="email" placeholder="Email" required />

            <label htmlFor="password">Password:</label>
            <input type="password" name="password" placeholder="Password" required />

            <button id='submit-btn' type="submit">Submit</button>

            <div id="error-msg" className='subcap centered hide error'></div>
            <p id='signup-err-isRegistered' className='subcap centered hide'>That email is already registered.<Link href={"/login"}> Click here to log in.</Link></p>

          </form>

          <div id="success-msg" className='centered'></div>


        </div>
      </section>
    </>

  )
}