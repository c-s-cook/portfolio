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
    const email = formData.get('email')
    const password = formData.get('password')
    const isSignup = true;
    const errorMsg = document.getElementById('error-msg')
    errorMsg.textContent = ''
 
    const response = await fetch('./api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, isSignup }),
    })
 
    if (response.status == 201) {
        
      router.push('/about')
    } else {
      // Handle errors
      console.log('res status: ', response.status)
      let err = await response.json()
      console.log("I'm the awaited signup page: ", err)
      errorMsg.textContent = err.email + err.password
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
            <div id="error-msg"> </div>
            <button type="submit">Sign up</button>
            </form>
        </div>
    </section>
    </>

  )
}