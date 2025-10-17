"use client"


import { useRouter } from "next/navigation";
import { useEffect } from "react";

import type { AuthType } from "../../../../lib/types";

const passwordReset = async ({ params }: { params: { params: Array<string> } }) => {
    const router = useRouter()


    let userId: string;
    let resetToken: string;
    let resetTime: Date;
    let authType: AuthType = "RESET"

    if (params.params) {
        userId = params.params[0];
        resetToken = params.params[1];
        resetTime = new Date(params.params[2]);
    }



    console.log("reset received params.tokens: ", userId, resetToken);



    useEffect(() => {
        const verifyMsg = document.getElementById('verification-msg')

        fetch('../../api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, resetToken, resetTime, authType }),
        }).then(async (response) => {
            if (response.status == 201) {

                verifyMsg.textContent = "Verification Complete. Rerouting..."

                router.push('/dashboard')

            } else {
                // Handle errors
                console.log('res status: ', response.status)
                let err = await response.json()
                console.log("I'm the awaited verification page: ", err)
                verifyMsg.textContent = "Error: " + err.email + err.password
            }
        })




    }, [])



    return (
        <>
            <section>
                <div className="content auth with-background bg-grad">
                    <div id="verification-msg" className="centered"> Verifying... </div>
                </div>
            </section>
        </>
    );
}

export default passwordReset;