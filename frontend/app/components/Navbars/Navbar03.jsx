"use client"

import Link from "next/link";

import './Navbar03.css'

export default function Navbar03() {
    const unCheckbox = () => {
        const box = document.getElementById('checkbox_toggle');
        box.checked = false;
    }

  return (
    <>
    <nav className="navbar">
      {/* LOGO */}
      <div className="logo">ME! (dev)</div>

      {/* NAVIGATION MENU */}
      <div className="nav-links">

        {/* USING CHECKBOX HACK */}
        <input type="checkbox" id="checkbox_toggle"/>
        <label htmlFor="checkbox_toggle" className='hamburger'></label>

        {/* NAVICATION MENU */}
        <ul className="menu">

          <li><Link href="/" onClick={unCheckbox}>Home</Link></li>
          <li><Link href="/about" onClick={unCheckbox}>About</Link></li>

          <li className='dropdown-parent'>
            <Link href="/" onClick={unCheckbox}>Services</Link>

              {/* DROPDOWN MENU  */}
              <ul className="dropdown">
                <li><Link href="/">Drop 1</Link></li>
                <li><Link href="/">Drop 2</Link></li>
                <li><Link href="/">Drop 3</Link></li>
                <li><Link href="/">Drop 4</Link></li>
              </ul>
          </li>

          <li><Link href="/" onClick={unCheckbox}>Pricing</Link></li>
          <li><Link href="/" onClick={unCheckbox}>Contact</Link></li>

        </ul>
      </div>
    </nav>
    <span className="nav-divider"></span>
    </>
  )
}
