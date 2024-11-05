"use client"

import { FormEvent } from 'react'
// import { useRouter } from 'next/router'
import { useRouter } from 'next/navigation'
import { createRoot } from 'react-dom/client'
 
import '../authForms.css'
import { verify } from 'crypto'

export default function LoginPage() {
  const router = useRouter()


  const resendVerification = (email) => {
    console.log('within the reverify...')

    

    const handleResend = async (event) => {
      event.preventDefault();

      const resendBtn = document.getElementById('resend-btn')
      resendBtn.disabled = true;
      resendBtn.textContent = 'Requesting'
      const isReverify = true;

      const response = await fetch('./api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, isReverify }),
      })

      if(response.status == 201){
        resendBtn.textContent = 'Sent'
      } else {
        resendBtn.style.display = 'none'
        const errorMsg = document.getElementById('error-msg')
        errorMsg.innerHTML += 'Error Resending. :S'
      }
    }


    return (
      <div>
        <p>You need to verify your email account before you can log in.</p>
        <p>Need a new verification email? Click the button below:</p>
        <button classlist='small' id='resend-btn' onClick={handleResend} >Resend</button>
      </div>
      
    )
  }
 
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    console.log("submitting...")
 
    const formData = new FormData(event.currentTarget)
    const email = formData.get('email')
    const password = formData.get('password')
    const isLogin = true;
    const errorMsg = document.getElementById('error-msg') || document.createElement('div')
    errorMsg.textContent = ''

    const submitBtn = document.getElementById('submit-btn')
    submitBtn.disabled = true;
    submitBtn.textContent = 'SENDING...'
    submitBtn.classList.add('disabled')
 
    const response = await fetch('./api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, isLogin }),
    })
 
    if (response.status == 201) {
      router.push('/dashboard')
      
    } else {
      // Handle errors
      console.log('res status: ', response.status)
      let err = await response.json()
      console.log("I'm the awaited signup page: ", err)
      
      submitBtn.disabled = false;
      submitBtn.textContent = 'LOG IN'
      submitBtn.classList.remove('disabled')

      if(err.password.includes('Please verify')){
        console.log('need to reverify...')
        const verifyMsg = resendVerification(email)
        console.log(verifyMsg)
        // errorMsg.innerHTML = verifyMsg[0]
        createRoot(errorMsg).render(verifyMsg)
      } else {
        console.log('dont need reverify i guess...')
        errorMsg.textContent = err.email + err.password
      }
      

      // add a button + functions to 'resend verification email'
    }
  }
 
  return (
    <>
    <section>
        <div className="content">
            {/* <h2>Log In</h2> */}
            <form onSubmit={handleSubmit}>
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            <button id='submit-btn' type="submit">Log in</button>
            </form>
            <div id="error-msg"></div>
        </div>
    </section>
    </>

  )
}