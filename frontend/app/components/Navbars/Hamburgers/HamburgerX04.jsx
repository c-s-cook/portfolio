"use client"

// Author: Mikael Ainalem
// https://codepen.io/ainalem/pen/LJYRxz

import './HamburgerX04.css'

export default function HamburgerX04({width}) {
  const lineStyle = {
    "stroke-width": width | 1.5
  }

  return (
    <>
    <svg class="ham hamRotate ham7" viewBox="0 0 100 100">
            <path
                class="line top"
                style={lineStyle}
                d="m 70,33 h -40 c 0,0 -6,1.368796 -6,8.5 0,7.131204 6,8.5013 6,8.5013 l 20,-0.0013" />
            <path
                class="line middle"
                style={lineStyle}
                d="m 70,50 h -40" />
            <path
                class="line bottom"
                style={lineStyle}
                d="m 69.575405,67.073826 h -40 c -5.592752,0 -6.873604,-9.348582 1.371031,-9.348582 8.244634,0 19.053564,21.797129 19.053564,12.274756 l 0,-40" />
        </svg>
    </>
  )
}
