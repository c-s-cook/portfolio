"use client"

import { usePathname } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { clientCookies } from "@lib/clientCookies";

export default function DemoBanner() {
    const pathname = usePathname();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    // check for logged-in User & admin
    useEffect(() => {
        const userCookie = clientCookies.get('user');
        if (userCookie) {
            const userData = JSON.parse(userCookie);
            // User is logged in
            setIsLoggedIn(true);
            if (userData.admin) setIsAdmin(true);
        } else {
            // User is not logged in
            setIsLoggedIn(false);
            setIsAdmin(false);
        }
    }, [pathname])

    return (
        <>
            <Suspense fallback={(<></>)}>
                {isLoggedIn && !isAdmin && pathname.includes('dashboard') && <div id="demo-mode" className='visible'>DEMO MODE</div>}
            </Suspense>
        </>
    )
}