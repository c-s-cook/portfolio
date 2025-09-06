import './Background.css'
import Image from 'next/image'


export default function Background() {
  return (
    <div id="background">
      <div></div>
      <div></div>
      <div></div>
      <div>
          <svg
            viewBox="0 0 900 900"
            xmlns='http://www.w3.org/2000/svg'>

            <filter id='noiseFilter'>
              <feTurbulence
                type='fractalNoise'
                baseFrequency='1'
                numOctaves='1'
                stitchTiles='stitch' />
            </filter>

            <rect
              width='100%'
              height='100%'
              filter='url(#noiseFilter)' />
          </svg>
      </div>
    </div>
  )
}
