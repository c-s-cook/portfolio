"use client"

import { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import type { AuthType } from '../../../lib/types'
 
import '../authForms.css'

export default function SignupPage() {
  const router = useRouter()
 
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault() 
 
    const formData = new FormData(event.currentTarget)
    const form = document.getElementById('signup-form')
    const email = formData.get('email')
    const password = formData.get('password')
    const authType:AuthType = "SIGN-UP"

    const errorMsg = document.getElementById('error-msg')
    errorMsg.textContent = ''

    const submitBtn = document.getElementById('submit-btn')
    submitBtn.disabled = true;
    submitBtn.textContent = 'SENDING...'
    submitBtn.classList.add('disabled')

 
    const response = await fetch('./api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, authType }),
    })
 
    if (response.status == 201) {

      form.classList.add('disable')
      form.style.display = 'none'
      errorMsg.textContent = `Thank you for signing up. I've sent an email to ${email} with a link to verify your email address and activate your account.`
      
    } else {
      // Handle errors

      let err = await response.json()
      errorMsg.textContent = err.email + err.password
      submitBtn.disabled = false;
      submitBtn.textContent = "Sign up"
    }
  }
 
  return (
    <>
    <section>
        <div className="content">
            {/* <h2>Log In</h2> */}
            <form id='signup-form' onSubmit={handleSubmit}>
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            <button id='submit-btn' type="submit">Sign up</button>
            </form>
            <div id="error-msg" className='centered'> </div>
        </div>
    </section>
    </>

  )
}