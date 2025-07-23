import './globals.css'
import './styles.css'
import { Quicksand } from 'next/font/google'


import Navbar from './components/Navbars/Navbar'
import Background from './components/Background'




export const dynamic = 'force-dynamic'

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

export default function RootLayout({ children }) {
  
  const navLinks = [
    { href: "/",        text: "Main" },
    { href: "/about",   text: "About?" },
    { href: "/",        text: "Costs" },
    { href: "/",        text: "Comminucations" }
  ];



  return (
    <html lang="en">
      {/* INSERT JavaScript file for hideNavBar here with defer */}
      <body className={quicksand.className}>
        <Background />
        <main className='scrollsnap'>
          <Navbar navLinks={navLinks} />
          {children}
          <footer>Copyright 2024 Christopher Cook. All rights reserved.</footer>
        </main>
      </body>
    </html>
  )
}
