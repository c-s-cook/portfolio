import './Navbar.css'

import Image from 'next/image'
import Link from 'next/link'
import HamburgerX01 from './Hamburgers/HamburgerX01'


//  NAVBAR - v2
//    Working to add...
//      - animated hamburger -> X button
//      - animated slide-in menu when in mobile view
// { String.fromCharCode(9776) }


export default function Navbar({ user }) {
  return (
    <>
    <nav className="navbar">
      {/* LOGO */}
      <div className="logo">Christopher Cook</div>

      {/* NAVIGATION MENU */}
      <ul className="nav-links">

        {/* USING CHECKBOX HACK */}
        <input type="checkbox" id="checkbox_toggle"/>
        <label htmlFor="checkbox_toggle" className='hamburger'><HamburgerX01 width={2} /></label>

        {/* NAVICATION MENU */}
        <div className="menu">

          <li><Link href="/">Home</Link></li>
          <li><Link href="/about">About</Link></li>

          <li className='services'>
            <Link href="/">Services</Link>

              {/* DROPDOWN MENU  */}
              <ul className="dropdown">
                <li><Link href="/">Drop 1</Link></li>
                <li><Link href="/">Drop 2</Link></li>
                <li><Link href="/">Drop 3</Link></li>
                <li><Link href="/">Drop 4</Link></li>
              </ul>
          </li>

          <li><Link href="/">Pricing</Link></li>
          <li><Link href="/">Contact</Link></li>

        </div>
      </ul>
    </nav>
    <span className="nav-divider"></span>
    </>
  )
}