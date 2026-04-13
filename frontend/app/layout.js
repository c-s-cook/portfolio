import './globals.css'
import './styles.css'
import { Quicksand } from 'next/font/google'
import { cookies } from 'next/headers'



import Navbar from './components/Navbars/Navbar'
import Background from './components/Background/Background'




// export const dynamic = 'force-dynamic'

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata = {
  title: 'Christopher Cook | WebDev Portfolio',
  description: 'Full Stack Web Development Portfolio by Christopher Cook',
}

export default async function RootLayout({ children }) {

  const navLinks = [
    { href: "/", text: "Main" },
    { href: "/#projects", text: "Projects" },
    { href: "/#certifications", text: "Certifications" },
    { href: "/dashboard", text: "Dashboard" }
  ];

  // check for login
  let isLoggedin = (await cookies()).get('jwt')?.value ? true : false;


  return (
    <html lang="en">
      {/* INSERT JavaScript file for hideNavBar here with defer */}
      <body className={quicksand.className}>
        <Background />
        <div className='scrollsnap-container'>
          <Navbar isLoggedIn={isLoggedin} navLinks={navLinks} />
          {children}
          <footer className='scrollsnap'>
            Copyright 2026 Christopher Cook. All rights reserved.
          </footer>
        </div>

      </body>
    </html>
  )
}
