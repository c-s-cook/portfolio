"use client"

// Author: Mikael Ainalem
// https://codepen.io/ainalem/pen/LJYRxz

import './HamburgerX02.css'

export default function HamburgerX02({width}) {
  const lineStyle = {
    "stroke-width": width | 1.5
  }
  return (
    <>
    <svg class="ham hamRotate ham4" viewBox="0 0 100 100">
            <path
                class="line top"
                style={lineStyle}
                d="m 70,33 h -40 c 0,0 -8.5,-0.149796 -8.5,8.5 0,8.649796 8.5,8.5 8.5,8.5 h 20 v -20" />
            <path
                class="line middle"
                style={lineStyle}
                d="m 70,50 h -40" />
            <path
                class="line bottom"
                style={lineStyle}
                d="m 30,67 h 40 c 0,0 8.5,0.149796 8.5,-8.5 0,-8.649796 -8.5,-8.5 -8.5,-8.5 h -20 v 20" />
        </svg>
    </>
  )
}
