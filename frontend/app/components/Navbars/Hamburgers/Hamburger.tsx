"use client"

import { useState, useEffect } from 'react'

import HamburgerX01 from './HamburgerX01'
import HamburgerX02 from './HamburgerX02'
import HamburgerX03 from './HamburgerX03'
import HamburgerX04 from './HamburgerX04'

const Hamburger = () => {

    // // create an array of menu-icon components to iterate through
    const burgers = [
        (<HamburgerX01 width={2} key="burger-1" />),
        (<HamburgerX02 width={2} key="burger-2" />),
        (<HamburgerX03 width={2} key="burger-3" />),
        (<HamburgerX04 width={2} key="burger-4" />)
    ];

    const [currentBurger, setCurrentBurger] = useState(burgers[0])
    const [burgerCount, setBurgerCount] = useState(0)





    useEffect(() => {

        // rotate through the different animated hamburger icons
        const burgerFlipper = (box: HTMLInputElement) => {

            if (!box.checked) {
                setBurgerCount(burgerCount < 3 ? burgerCount + 1 : 0)
                setCurrentBurger(burgers[(burgerCount)]);
            }
        }

        const box = document.getElementById('nav_checkbox_toggle') as HTMLInputElement;

        if (box) box.addEventListener('change', () => burgerFlipper(box));
        return () => {
            if (box) box.removeEventListener('change', () => burgerFlipper(box));
        };
    }, []);


    return (
        <>
            {currentBurger}
        </>
    );
}

export default Hamburger;