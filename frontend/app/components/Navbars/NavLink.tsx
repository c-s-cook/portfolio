"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({ link, index }) {

    //  toggles the checkbox to false to hide the menu when Link is clicked
    const unCheckbox = async () => {
        const box = document.getElementById('nav_checkbox_toggle') as HTMLInputElement;
        if (box) box.checked = !box.checked;
    }

    const pathname = usePathname();



    return (
        <li key={index} className={`${pathname === link.href ? 'active' : ''}`}><Link href={link.href} onClick={unCheckbox}>{link.text}</Link></li>
    )
}