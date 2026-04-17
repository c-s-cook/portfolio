"use client"

import { useState, useEffect, useRef } from 'react'

import HamburgerX01 from './HamburgerX01'
import HamburgerX02 from './HamburgerX02'
import HamburgerX03 from './HamburgerX03'
import HamburgerX04 from './HamburgerX04'

const Hamburger = ({ boxChecked }: { boxChecked: boolean }) => {

    let lineWidth: number = 4;

    // // create an array of menu-icon components to iterate through
    const burgers = [
        (<HamburgerX01 width={lineWidth} key="burger-1" />),
        (<HamburgerX02 width={lineWidth} key="burger-2" />),
        (<HamburgerX03 width={lineWidth} key="burger-3" />),
        (<HamburgerX04 width={lineWidth} key="burger-4" />)
    ];

    const [currentBurger, setCurrentBurger] = useState(burgers[0])
    const [burgerCount, setBurgerCount] = useState<number>(0)


    useEffect(() => {

        if (boxChecked) {

            let tempCount: number = burgerCount < 3 ? burgerCount + 1 : 0;
            setTimeout(() => {
                // console.log('FLIPPING burgers! ', burgerCount, '->', tempCount);
                setBurgerCount(tempCount);
            }, 450);

        }
    }, [boxChecked]);



    return (
        <>
            {/* {currentBurger} */}
            {burgers[(burgerCount)]}
        </>
    );
}

export default Hamburger;