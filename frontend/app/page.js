import Image from 'next/image'
import Link from 'next/link'

import './styles.css'

import { Satisfy } from 'next/font/google'
const satisfy = Satisfy({ subsets: ['latin'], weight: ['400'] })


export default function Home() {
  return (
    <>
      <h1 className="text-big text-center">Home Page, bae-bay!</h1>
      
      <div className="section">
        <div className="section-title">
          <h1 className={satisfy.className}>About me...</h1>
        </div>
        
        <div className="body">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Pellentesque dignissim enim sit amet venenatis urna. In fermentum et sollicitudin ac orci phasellus egestas tellus. Cras semper auctor neque vitae. Tincidunt vitae semper quis lectus nulla at volutpat diam. Pellentesque diam volutpat commodo sed egestas egestas fringilla phasellus. Vel pharetra vel turpis nunc eget lorem. Sodales ut eu sem integer vitae justo eget magna. Egestas erat imperdiet sed euismod nisi porta lorem. Dui accumsan sit amet nulla facilisi. Mattis vulputate enim nulla aliquet porttitor lacus luctus accumsan. Turpis in eu mi bibendum neque egestas congue. Suspendisse interdum consectetur libero id faucibus nisl tincidunt.
        </p>
        <p>
          Odio morbi quis commodo odio aenean sed adipiscing diam donec. Quis auctor elit sed vulputate mi sit amet mauris. Porttitor eget dolor morbi non arcu risus. Quis ipsum suspendisse ultrices gravida dictum fusce. Sit amet justo donec enim diam vulputate ut. Habitant morbi tristique senectus et netus et malesuada fames ac. Lorem donec massa sapien faucibus et molestie ac feugiat sed. Sed vulputate mi sit amet mauris. Tincidunt eget nullam non nisi est. Lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt. Odio pellentesque diam volutpat commodo sed egestas. Cursus in hac habitasse platea dictumst quisque sagittis purus. Turpis massa sed elementum tempus. Ut consequat semper viverra nam libero justo laoreet sit amet. Nunc pulvinar sapien et ligula ullamcorper malesuada proin. Quis lectus nulla at volutpat. Condimentum mattis pellentesque id nibh tortor id.
        </p>
        </div>
      </div>
      

    </>
  )
}
