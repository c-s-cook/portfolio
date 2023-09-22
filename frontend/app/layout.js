import './globals.css'
import { Quicksand } from 'next/font/google'


import Navbar from './components/Navbars/Navbar'
import Background from './components/Background'

export const dynamic = 'force-dynamic'

const quicksand = Quicksand({ subsets: ['latin'] })

export const metadata = {
  title: 'Christopher Cook | WebDev Portfolio',
  description: 'Full Stack Web Development Portfolio by Christopher Cook',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={quicksand.className}>
        <Background />
        <Navbar />
        {children}
      </body>
    </html>
  )
}
