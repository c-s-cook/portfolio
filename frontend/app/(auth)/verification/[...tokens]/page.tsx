"use client"


import { useRouter } from "next/navigation";
import { useEffect } from "react";
// import 'dotenv/config'
import type { AuthType } from "../../../../lib/types";

const userVerification = async ({params}: {params: {tokens: Array<string>}}) => {
    const router = useRouter()

    const userId:string = params.tokens[0];
    const verificationToken:string = params.tokens[1];
    const authType: AuthType = "VERIFY"

    console.log("verify received params.tokens: ", userId, verificationToken);

        

    useEffect(() => {
        const verifyMsg = document.getElementById('verification-msg')

        fetch('../../api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, verificationToken, authType }),
          }).then(async (response) => {
            if(response.status == 201) {
                
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
    
        
        
        
    },[])

    

    return ( 
        <>
        <section>
            <div className="content">
                <div id="verification-msg" className="centered"> Verifying... </div>
            </div>
        </section>
        </>
     );
}
 
export default userVerification;