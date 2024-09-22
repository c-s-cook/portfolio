"use client"

import './Navbar.css'

import { Satisfy } from 'next/font/google'
const satisfy = Satisfy({ subsets: ['latin'], weight: ['400'] })


import Image from 'next/image'
import Link from 'next/link'
import HamburgerX01 from './Hamburgers/HamburgerX01'
import HamburgerX02 from './Hamburgers/HamburgerX02'
import HamburgerX03 from './Hamburgers/HamburgerX03'
import HamburgerX04 from './Hamburgers/HamburgerX04'
import { useState } from 'react'
import Background from '../Background'



export default function Navbar({ user }) {

  // create an array of menu-icon components to iterate through
  const burgers = [
    (<HamburgerX01 width={2} />),
    (<HamburgerX02 width={2} />),
    (<HamburgerX03 width={2} />),
    (<HamburgerX04 width={2} />)
  ];

  const [currentBurger, setCurrentBurger] = useState(burgers[0])
  const [burgerCount, setBurgerCount] = useState(0)

  // 
  const burgerFlipper = () => {
    const box = document.getElementById('checkbox_toggle');

    if(box.checked){ 
      // console.log('Box:check is TRUE!')
    }

    if(!box.checked){
      setBurgerCount(burgerCount < 3 ? burgerCount+1 : 0)
      setCurrentBurger(burgers[(burgerCount)]);
    }
  }
  
  //  toggles the checkbox to false to hide the menu when Link is clicked
  const unCheckbox = () => {
    const box = document.getElementById('checkbox_toggle');
    box.checked = false;
    burgerFlipper();
  }


  return (
    <>
    <nav className="navbar ">
      {/* LOGO */}
      <div className={satisfy.className} id='logo'><Link href="/">Christopher Cook</Link></div>

      {/* NAVIGATION MENU */}
      <ul className="nav-links">

        {/* USING CHECKBOX HACK */}
        <input type="checkbox" id="checkbox_toggle"/>
        <label htmlFor="checkbox_toggle" className='hamburger' onClick={ burgerFlipper }>{ currentBurger }</label>

        {/* NAVICATION MENU */}
        <div className="menu">

          <li><Link href="/" onClick={unCheckbox}>Home</Link></li>
          <li><Link href="/about" onClick={unCheckbox}>About</Link></li>
          <li><Link href="/" onClick={unCheckbox}>Pricing</Link></li>
          <li><Link href="/" onClick={unCheckbox}>Contact</Link></li>

        </div>
      </ul>

      {/* BACKGROUND FADE ATTEMPT */}
      <div className="nav-background">
        <Background/>
      </div>
    </nav>
    <span className="nav-divider"></span>
    </>
  )
}