// "use client"

import './Navbar.css'


import Background from '../Background/Background'
import Logo from '../Logo/Logo'
import NavCheckbox from './NavCheckbox'
import DemoBanner from './DemoBanner'
import NavLink from './NavLink'
import LogInOut, {LiminalAuthIcon} from './LogInOut'
import { Suspense } from 'react'
// import path from 'path'





export default function Navbar({ navLinks }) {
  // const pathname = usePathname();

  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [isAdmin, setIsAdmin] = useState(false);


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
    "use server"
    if (!document) return;
    const box = document.getElementById('nav_checkbox_toggle') as HTMLInputElement;
    if (box) box.checked = !box.checked;
  }

  // // check for logged-in User & admin
  // useEffect(() => {
  //   const userCookie = clientCookies.get('user');
  //   if (userCookie) {
  //     const userData = JSON.parse(userCookie);
  //     // User is logged in
  //     setIsLoggedIn(true);
  //     if (userData.admin) setIsAdmin(true);
  //   } else {
  //     // User is not logged in
  //     setIsLoggedIn(false);
  //     setIsAdmin(false);
  //   }
  // }, [pathname])


  return (
    <>
      <nav id="navbar">
        {/* LOGO */}
        {/* <div className={satisfy.className} id='nav-logo'><Link href="/">Christopher Cook</Link></div> */}
        <Logo forNavBar={true} />

        {/* NAVIGATION MENU */}
        <ul className="nav-links">

          {/* USING CHECKBOX HACK FOR MOBILE NAV MENU */}
          <NavCheckbox />

          {/* NAVICATION MENU */}
          <div id='menu'>

            {links.map((link, index) => (
              <Suspense key={`sus-link-${index}`} fallback={(<li link-key={`link-${index}`}>{link.text}</li>)}>
                <NavLink key={index} link={link} index={index}/>
              </Suspense>
            ))}

            {/* LOG IN / OUT ICONS */}
            <Suspense fallback={(<LiminalAuthIcon/>)}>
              <LogInOut />
            </Suspense>
              

            <div id="nav-menu-background">
              <Background />
            </div>

          </div>
        </ul>

        {/* BACKGROUND FADE ATTEMPT */}
        <div className="nav-background">
          <Background />
        </div>
      </nav>

      {/* DIVIDER LINE */}
      <span id="nav-divider"></span>

      {/* BANNER ALERT FOR NON-ADMIN USERS */}
      <Suspense fallback={(<></>)}>
            <DemoBanner/>
      </Suspense>
      
    </>
  )
}