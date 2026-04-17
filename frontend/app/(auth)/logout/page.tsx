"use client"

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import type { AuthType } from '../../../lib/types'

import '../authForms.css'

export default function LogoutPage() {
  const router = useRouter()

  async function handleLogout() {

    const authType: AuthType = "LOG-OFF"
    const isLogout = true;
    const logoutMsg = document.getElementById('logout-msg')

    const countdownMsg = document.getElementById('countdown-msg')
    logoutMsg.textContent = ''
    countdownMsg.textContent = ''

    const response = await fetch('./api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authType }),
    })

    if (response.status == 200) {
      let res = await response.json()
      logoutMsg.textContent = res.message

      // send them to the home page...
      let delay = 3;  // in seconds

      const intervalId = setInterval(() => {
        clearInterval(intervalId);
        router.replace('/?logout=true')
      }, delay*1000);

    } else {
      // Handle errors
      let err = await response.json()
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
          <div id="logout-msg" className='centered'></div>
          <div id="countdown-msg"></div>
        </div>
      </section>
    </>

  )
}