import Image from 'next/image'
import Link from 'next/link'
import './Navbar01.css'


//  NAVBAR - v1
//    The most basic, responsive navbar possible


export default function Navbar({ user }) {
  return (
    <nav className="navbar">
      {/* LOGO */}
      <div className="logo">MUO</div>

      {/* NAVIGATION MENU */}
      <ul className="nav-links">

        {/* USING CHECKBOX HACK */}
        <input type="checkbox" id="checkbox_toggle"/>
        <label htmlFor="checkbox_toggle" className='hamburger'>{ String.fromCharCode(9776) }</label>

        {/* NAVICATION MENU */}
        <div className="menu">

          <li><Link href="/">Home</Link></li>
          <li><Link href="/">About</Link></li>

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
  )
}