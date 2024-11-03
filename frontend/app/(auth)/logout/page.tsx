"use client"

// import { FormEvent } from 'react'
// import { useRouter } from 'next/router'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
 
import '../authForms.css'

export default function LogoutPage() {
  const router = useRouter()

 
  async function handleLogout() {
    

    console.log("attempting log out...")

    const isLogout = true;
    const logoutMsg = document.getElementById('logout-msg')
    
    const countdownMsg = document.getElementById('countdown-msg')
    logoutMsg.textContent = ''
    countdownMsg.textContent = ''
 
    const response = await fetch('./api/auth', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
 
    if (response.status == 200) {
      let res = await response.json()
      logoutMsg.textContent = res.message
      // router.push('/dashboard')
      
    } else {
      // Handle errors
      console.log('res status: ', response.status)
      let err = await response.json()
      console.log("I'm the awaited logout page: ", err)
      logoutMsg.textContent = err.email + err.password
    }
  }

  
  useEffect(() => {
    handleLogout()
  }, [])
 
  return (
    <>
    <section>
        <div className="content">
            {/* <h2>Log In</h2> */}
            <div id="logout-msg"></div>
            <div id="countdown-msg"></div>
        </div>
    </section>
    </>

  )
}