"use client"

// Author: Mikael Ainalem
// https://codepen.io/ainalem/pen/LJYRxz

import './HamburgerArrow02.css'

export default function HamburgerArrow02({width}) {
  const lineStyle = {
    "stroke-width": width | 1.5
  }
  return (
    <>
      <svg class="ham hamRotate180 ham5" viewBox="0 0 100 100" width="80" onClick={(e) => e.target.classList.toggle('active')}>
            <path
                class="line top"
                style={lineStyle}
                d="m 30,33 h 40 c 0,0 8.5,-0.68551 8.5,10.375 0,8.292653 -6.122707,9.002293 -8.5,6.625 l -11.071429,-11.071429" />
            <path
                class="line middle"
                style={lineStyle}
                d="m 70,50 h -40" />
            <path
                class="line bottom"
                style={lineStyle}
                d="m 30,67 h 40 c 0,0 8.5,0.68551 8.5,-10.375 0,-8.292653 -6.122707,-9.002293 -8.5,-6.625 l -11.071429,11.071429" />
        </svg>
    </>
  )
}