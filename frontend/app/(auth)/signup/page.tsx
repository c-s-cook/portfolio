"use client"

import { FormEvent } from 'react'
// import { useRouter } from 'next/router'
import { useRouter } from 'next/navigation'
 
import '../authForms.css'

export default function SignupPage() {
  const router = useRouter()
 
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    console.log("submitting...")
    
 
    const formData = new FormData(event.currentTarget)
    const form = document.getElementById('signup-form')
    const email = formData.get('email')
    const password = formData.get('password')
    const isSignup = true;

    const errorMsg = document.getElementById('error-msg')
    errorMsg.textContent = ''

    const submitBtn = document.getElementById('submit-btn')
    submitBtn.disabled = true;
    submitBtn.textContent = 'SENDING...'
    submitBtn.classList.add('disabled')

 
    const response = await fetch('./api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, isSignup }),
    })
 
    if (response.status == 201) {

      form.classList.add('disable')
      form.style.display = 'none'
      errorMsg.textContent = `Thank you for signing up. I've sent a email to ${email} with a link to verify your email address and activate your account.`
        
      // router.push('/about')
    } else {
      // Handle errors
      console.log('res status: ', response.status)
      let err = await response.json()
      console.log("I'm the awaited signup page: ", err)
      errorMsg.textContent = err.email + err.password
      submitBtn.disabled = false;
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
            <div id="error-msg"> </div>
        </div>
    </section>
    </>

  )
}