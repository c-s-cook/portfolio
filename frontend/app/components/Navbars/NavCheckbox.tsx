"use client"

import { useState, Suspense } from "react"
import Hamburger from './Hamburgers/Hamburger'
import './Navbar.css'


export default function NavCheckbox() {

    const [boxChecked, setBoxChecked] = useState(false);

    //  toggles the checkbox to false to hide the menu when Link is clicked
    const unCheckbox = async () => {

        if (boxChecked) {
            // setBoxChecked(false);
            const box = document.getElementById('nav_checkbox_toggle') as HTMLInputElement;
            if (box) box.checked = false;
        }

        setBoxChecked(!boxChecked);

    }

    return (
        <>
        <Suspense fallback={(<input type="checkbox" id="nav_checkbox_toggle"/>)}>
            {/* USING CHECKBOX HACK */}
            <input type="checkbox" id="nav_checkbox_toggle" onClick={unCheckbox} />
            {/* <label htmlFor="nav_checkbox_toggle" className='hamburger' onClick={ burgerFlipper }>{ currentBurger }</label> */}
            <label htmlFor="nav_checkbox_toggle" className='hamburger' ><Hamburger boxChecked={boxChecked} /></label>
        </Suspense>
        </>
    )
}