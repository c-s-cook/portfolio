"use client"

import { FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createRoot } from 'react-dom/client'
import type { AuthType } from '../../../lib/types'
 
import '../authForms.css'

export default function LoginPage() {
  const router = useRouter()

  

  useEffect(()=>{
    const errorMsg = document.getElementById('error-msg') || document.createElement('div')

    let expired = new URLSearchParams(document.location.search).get("expired")
    if(expired){
      errorMsg.textContent = 'Your session has expired. Please log back in to continue.'
    }
    
  }, [])


  const resendVerification = (email) => {

    const handleResend = async (event) => {
      event.preventDefault();

      const resendBtn: HTMLButtonElement = document.getElementById('resend-btn') as HTMLButtonElement
      resendBtn.disabled = true;
      resendBtn.textContent = 'Requesting'
      
      const authType:AuthType = 'RE-VERIFY'
      
      const response = await fetch('./api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, authType }),
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
      <div className='centered'>
        <p></p>
        <p>You need to verify your email account before you can log in.</p>
        <p>Need a new verification email? Click the button below:</p>
        <button className='small' id='resend-btn' onClick={handleResend} >Resend</button>
      </div>
      
    )
  }
 
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
 
    const formData = new FormData(event.currentTarget)
    const email = formData.get('email')
    const password = formData.get('password')
    
    const authType:AuthType = 'LOG-IN'

    const errorMsg = document.getElementById('error-msg')
    errorMsg.textContent = ' '

    const submitBtn: HTMLButtonElement = document.getElementById('submit-btn') as HTMLButtonElement
    submitBtn.disabled = true;
    submitBtn.textContent = 'SENDING...'
    submitBtn.classList.add('disabled')
 
    const response = await fetch('./api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, authType }),
    })
 
    if (response.status == 201) {
      router.push('/dashboard')
      
    } else {
      // Handle errors
      let err = await response.json()
      
      submitBtn.disabled = false;
      submitBtn.textContent = 'LOG IN'
      submitBtn.classList.remove('disabled')

      if(err.password.includes('Please verify')){
        const verifyMsg = resendVerification(email)
        createRoot(errorMsg).render(verifyMsg)
      } else {
        errorMsg.textContent = err.email + err.password + err.message
      }
    }
  }
 
  return (
    <>
    <section>
        <div className="content">
            <form onSubmit={handleSubmit} id='login-form' className='with-background bg-grad'>

              

              <label htmlFor="email">Email:</label>
              <input type="email" name="email" id="email" placeholder="Email" required />
              
              
              <label htmlFor="password">Password:</label>
              <input type="password" name="password" id="password" placeholder="Password" required />
              
              

              <button id='submit-btn' type="submit">Log in</button>
            </form>
            <div id="error-msg" className='centered error'> </div>
        </div>
    </section>
    </>

  )
}