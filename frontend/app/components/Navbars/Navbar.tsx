"use client"

import './Navbar.css'

// import { Satisfy } from 'next/font/google'
// const satisfy = Satisfy({ subsets: ['latin'], weight: ['400'] })


// import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Background from '../Background/Background'
import Logo from '../Logo/Logo'
import { usePathname } from 'next/navigation'
import Hamburger from './Hamburgers/Hamburger'
import { clientCookies } from '@lib/clientCookies'
// import path from 'path'



export default function Navbar({ navLinks }) {
  const pathname = usePathname();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [boxChecked, setBoxChecked] = useState(false);


  //  create default array of nav menu items
  const navLinkDefaults = [
    {
      href: "/",
      text: "Home"
    },
    {
      href: "/about",
      text: "About"
    },
    {
      href: "/",
      text: "Pricing"
    },
    {
      href: "/dashboard",
      text: "Dashboard"
    }
  ];

  let links = navLinks ? navLinks : navLinkDefaults;


  //  toggles the checkbox to false to hide the menu when Link is clicked
  const unCheckbox = async () => {

    if (boxChecked) {
      // setBoxChecked(false);
      const box = document.getElementById('nav_checkbox_toggle') as HTMLInputElement;
      if (box) box.checked = false;
    }
    
    setBoxChecked(!boxChecked);

  }

  // check for logged-in User & admin
  useEffect(() => {
    const userCookie = clientCookies.get('user');
    if (userCookie) {
      const userData = JSON.parse(userCookie);
      // User is logged in
      setIsLoggedIn(true);
      if (userData.admin) setIsAdmin(true);
    } else {
      // User is not logged in
      setIsLoggedIn(false);
      setIsAdmin(false);
    }
  }, [pathname])


  return (
    <>
      <nav id="navbar">
        {/* LOGO */}
        {/* <div className={satisfy.className} id='nav-logo'><Link href="/">Christopher Cook</Link></div> */}
        <Logo forNavBar={true} />

        {/* NAVIGATION MENU */}
        <ul className="nav-links">

          {/* USING CHECKBOX HACK */}
          <input type="checkbox" id="nav_checkbox_toggle" onClick={unCheckbox} />
          {/* <label htmlFor="nav_checkbox_toggle" className='hamburger' onClick={ burgerFlipper }>{ currentBurger }</label> */}
          <label htmlFor="nav_checkbox_toggle" className='hamburger' ><Hamburger boxChecked={boxChecked} /></label>

          {/* NAVICATION MENU */}
          <div id='menu'>

            {links.map((link, index) => (
              <li key={index} className={`${pathname === link.href ? 'active' : ''}`}><Link href={link.href} onClick={unCheckbox}>{link.text}</Link></li>
            ))}
            {isLoggedIn && !pathname.includes('logout') && <li>
              <Link href={'/logout'} onClick={unCheckbox}>Logout</Link>
            </li>}

            <div id="nav-menu-background">
              <Background />
            </div>


            {/* <li><Link href="/" onClick={unCheckbox}>Home</Link></li>
          <li><Link href="/about" onClick={unCheckbox}>About</Link></li>
          <li><Link href="/" onClick={unCheckbox}>Pricing</Link></li>
          <li><Link href="/" onClick={unCheckbox}>Contact</Link></li> */}

          </div>
        </ul>

        {/* BACKGROUND FADE ATTEMPT */}
        <div className="nav-background">
          <Background />
        </div>
      </nav>
      <span id="nav-divider"></span>
      {isLoggedIn && !isAdmin && pathname.includes('dashboard') && <div id="demo-mode" className='visible'>DEMO MODE</div>}
    </>
  )
}