"use client"

import { FormEvent } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { AuthType } from '../../../../lib/types'

import '../../authForms.css'
import { error } from 'console'

// export default function resetPassword({ params }: { params: { params: Array<string> } }) {
export default function ResetPassword() {
    const router = useRouter();
    const params = useParams();

    // state variables
    let [email, setEmail] = useState<string>('');
    let [password1, setPassword1] = useState<string>('');
    let [password2, setPassword2] = useState<string>('');
    let [errorMsg, setErrorMsg] = useState<string>('');
    let [successMsg, setSuccessMsg] = useState<string>('');



    // run on first load...
    useEffect(() => {
        // Check for params / tokens
        try {
            if (params.params && params.params.length > 0) {


                if (params.params.length != 3) throw Error('Invalid Reset Link. Not 3 params');

                let userId: string = params.params[0];
                let resetToken: string = params.params[1];
                let resetTime = new Date(Number(params.params[2]));

                // check that the token is valid & hasn't expired
                if (!(resetTime instanceof Date) || isNaN(resetTime.getTime())) throw Error('Invalid Reset Link. Time issue.');
                if (Date.now() > resetTime.getTime()) throw Error('The link has expired.')

                const authType: AuthType = "RESET"
                const resetCheck: Boolean = true;

                // validate with backend db
                setSuccessMsg('Validating link...');

                fetch('../../api/auth', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, resetToken, resetTime, authType, resetCheck }),
                }).then(async (response) => {
                    if (response.ok) {

                        setSuccessMsg('');
                        setErrorMsg('');
                        document.getElementById('update-password-form').classList.toggle('hide');

                        // router.push('/dashboard')

                    } else {
                        // Handle errors
                        console.log('res status: ', response.status)
                        let err = await response.json()
                        console.log("I'm the awaited verification page: ", err)
                        setErrorMsg(`Error:  ${err}`);
                    }
                })




            } else {
                document.getElementById('request-reset-form').classList.toggle('hide');
            }
        }
        catch (error) {
            console.log(error);
            setErrorMsg(`${error}`)
        }


        // If no params, show "request link" form
    }, [params])


    // handle updates to the ERROR MSG
    useEffect(() => {
        if (errorMsg != '') {
            setSuccessMsg('');
            document.getElementById('error-msg').classList.remove('hide');
            document.getElementById('success-msg').classList.add('hide');
        }
        else document.getElementById('error-msg').classList.add('hide');

    }, [errorMsg])

    //  handle updates to the SUCCESS MSG
    useEffect(() => {
        if (successMsg != '') {
            setErrorMsg('');
            document.getElementById('error-msg').classList.add('hide');
            document.getElementById('success-msg').classList.remove('hide');
        }
        else document.getElementById('success-msg').classList.add('hide');

    }, [successMsg])







    // handle the REQUEST form...
    async function handleRequestReset(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        // const formData = new FormData(event.currentTarget)
        // const form = document.getElementById('request-reset-form')
        // const email = formData.get('email')
        const authType: AuthType = "REQUEST-RESET"

        setErrorMsg('');

        const submitBtn = document.getElementById('submit-request-btn') as HTMLButtonElement;
        submitBtn.disabled = true;
        submitBtn.textContent = 'SENDING...'
        // submitBtn.classList.add('disabled')


        const response = await fetch('./api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, authType }),
        })

        if (response) {


            document.getElementById('request-reset-form').classList.toggle('hide');

            setSuccessMsg(`All done here. If a user account exists, an email will be sent to ${email} with a link to reset the password.`);

        } else {
            // Handle errors if no response is received.
            setErrorMsg('Server error. Please try again later.')
            submitBtn.disabled = false;
            submitBtn.textContent = "Submit"
        }
    }


    // handle the UPDATE form...
    async function handleUpdatePassword(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        let userId: string = params.params[0];
        let resetToken: string = params.params[1];
        let resetTime = new Date(Number(params.params[2]));

        if (password1 != password2) {
            setErrorMsg('Passwords must match.');
        }
        else if(password1.length < 6){
            setErrorMsg('Minimum password length is 6 characters.')
        }
        else if (!userId || !resetToken || !resetTime) {
            setErrorMsg('Hmm..Odd server issue here. Sorry. Please try the link again.')
        }
        else {
            const submitBtn = document.getElementById('submit-request-btn') as HTMLButtonElement;
            submitBtn.disabled = true;
            submitBtn.textContent = 'SENDING...'

            const form = document.getElementById('update-password-form')

            const authType: AuthType = "RESET"


            // send new password to backend / db
            // setSuccessMsg('Validating link...');

            fetch('../../api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, resetToken, resetTime, authType, password: password1 }),
            }).then(async (response) => {
                if (response.ok) {

                    setSuccessMsg('Your password has been updated.');
                    setErrorMsg('');
                    document.getElementById('update-password-form').classList.toggle('hide');


                    setTimeout(() => {
                        router.push('/login')
                    }, 3000)

                } else {
                    // Handle errors
                    console.log('res status: ', response.status)
                    let err = await response.json()
                    console.log("I'm the awaited verification page: ", err)
                    setErrorMsg(`Error:  ${err}`);
                }
            })
        }



    }




    return (
        <>
            <section className='full'>
                <div className="content auth with-background bg-grad">

                    {/* FORM TO REQUEST A RESET LINK */}
                    <form id='request-reset-form' onSubmit={handleRequestReset} className='auth hide'>

                        <h3>Password Reset:</h3>
                        <p className='subcap'>Enter the email associated with your account and I&apos;ll send you a password reset link.</p>

                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />

                        <button id='submit-request-btn' type="submit">Submit</button>

                    </form>

                    {/* FORM TO UPDATE PASSWORD  */}
                    <form id='update-password-form' onSubmit={handleUpdatePassword} className='auth hide'>

                        <h3>Update Password:</h3>
                        <p className='subcap'>You have shown yourself to be worthy! ...of updating your password.</p>

                        <label htmlFor="password1">Updated Password:</label>
                        <input
                            type="password"
                            name="password1"
                            placeholder="New Password"
                            value={password1}
                            onChange={e => setPassword1(e.target.value)}
                            required
                        />

                        <label htmlFor="password2">Confirm Password:</label>
                        <input
                            type="password"
                            name="password2"
                            placeholder="Confirm Password"
                            value={password2}
                            onChange={e => setPassword2(e.target.value)}
                            required
                        />

                        <button id='submit-update-btn' type="submit">Submit</button>

                    </form>

                    {/* ERROR / SUCCESS MESSAGES */}
                    <div id="error-msg" className='subcap centered hide error'>{errorMsg}</div>
                    <div id="success-msg" className='centered hide'>{successMsg}</div>


                </div>
            </section>
        </>

    )
}