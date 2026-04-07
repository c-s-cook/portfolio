"use client"

import './Logo.css';
import Link from 'next/link'
import { useEffect } from 'react';

import { Satisfy } from 'next/font/google'
const satisfy = Satisfy({ subsets: ['latin'], weight: ['400'] })

/**
 * a react compontent that returns the stylized name-as-logo
 * for use in navbar and on the homepage banner. This function
 * also houses the IntersectionObserver for toggling the 
 * navbar visibility when on the homepage.
 * 
 * @param   {boolean}   forNavBar   Optional. Set true if instance is for the navbar
 * 
 * @returns {React Node}            if !forNavBar it returns a large, main-page banner 'logo' + subtitle 
 *                                  if forNavBar = true, it returns a small version of just the 'logo'
 * 
 */


const Logo = ({forNavBar = false}: {forNavBar?: boolean}) => {

    useEffect(() => {
        // TO-DO: need to switch this to an actual React/useState methodology

        const mainLogoGet = document.getElementById('main-logo');
        const navLogo = document.getElementById('nav-logo');
        const navMenu = document.getElementById('menu');
        const navDivider = document.getElementById('nav-divider');
        const demoModeBar = document.getElementById('demo-mode');
        let mainLogoVisible = mainLogoGet ? true : false;

        const toggleNavbarVisible = () => {
            if(mainLogoVisible){
                navLogo.classList.remove('visible');
                navMenu.classList.remove('visible');
                navDivider.classList.remove('visible');
                if(demoModeBar) demoModeBar.classList.remove('visible');
            } else {
                navLogo.classList.add('visible');
                navMenu.classList.add('visible');
                navDivider.classList.add('visible');
                if(demoModeBar) demoModeBar.classList.add('visible');
            }
        }
        toggleNavbarVisible();
    
        if (mainLogoGet){

            const hideLogo = (entries) => {
                // looks at the first (should be only) entry
                // ".isIntersecting" equates to the object being
                // visible within the window.
                mainLogoVisible = entries[0].isIntersecting;
                toggleNavbarVisible();
            }
      
            let observerOptions = {
                root: null,
                rootMargin: "30px",
                threshold: 1.0,
            }
      
            const observer = new IntersectionObserver(hideLogo, observerOptions);
            observer.observe(mainLogoGet);

        } else {
            toggleNavbarVisible();
        }
    
      }, [])

    if(!forNavBar){
        return (
            <>
                <div id="main-logo">
                    <p className={satisfy.className} id="main-logo-text">Christopher Cook</p>
                
                    <p id="logo-subtitle">Full Stack Web Developer</p>
                </div>
            </>
        );
    } else {
        return ( 
            <>
                <div className={satisfy.className} id='nav-logo'><Link href="/">Christopher Cook</Link></div>
            </>
        );
    }
}
 
export default Logo;