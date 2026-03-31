"use client"


import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
// import 'dotenv/config'
import type { AuthType } from "../../../../lib/types";

const UserVerification = () => {
    const router = useRouter();
    const params = useParams();

    let userId:string, verificationToken:string;

    if (params.tokens) {
        userId = params.tokens[0];
        verificationToken = params.tokens[1];
    }
    const authType: AuthType = "VERIFY"


    // console.log("verify received params.tokens: ", userId, verificationToken);



    useEffect(() => {
        const verifyMsg = document.getElementById('verification-msg')



        if (userId && verificationToken) {
            verifyMsg.textContent = "Verifying...";

            fetch('../../api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, verificationToken, authType }),
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
        }
        else verifyMsg.textContent = "Please check your email for a verification link.";


    }, [])



    return (
        <>
            <section>
                <div className="content">
                    <div id="verification-msg" className="centered">  </div>
                </div>
            </section>
        </>
    );
}

export default UserVerification;