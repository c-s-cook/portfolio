
// Following this tut:
//      https://blog.logrocket.com/animating-mobile-menus-using-css/


//  Commenting this out so it doesn't mess up DEV by weird imports
// import './Navbar02.css'

export default function Navbar02() {
  return (
    <>
        <div className="navbar">
            {/* The nav bar with logo and menu items */}
            <nav className="menu">
                <h4>Logo</h4>

                <label htmlFor="menu-check" className='menu-btn'>
                    <input type="checkbox" id="menu-check" />
                    {/* The hamburger menu */}
                    <div className="menu-hamburger">
                        <ul className="menu-items">
                            <li>Home</li>
                            <li>About</li>
                            <li>Contact</li>
                        </ul>
                    </div>
                </label>

            </nav>
        </div>
    </>
  )
}
