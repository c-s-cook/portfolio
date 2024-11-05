import * as nodemailer from 'nodemailer'
import 'dotenv/config'

export interface Email {
    from: string,
    to: string,
    subject: string,
    text: string, 
    html?: string,
}


export async function sendMail({ from, to, subject, text, html }: Email) {

    try {
        let mailOptions = ({
            from,
            to,
            subject,
            text,
            html
        })
        //asign createTransport method in nodemailer to a variable
        //service: to determine which email platform to use
        //auth contains the senders email and password which are all saved in the .env
        const Transporter = nodemailer.createTransport({

            pool: true,
            host: "smtp.dreamhost.com",
            port: 465,
            secure: true, // use TLS
            auth: {
                user: process.env.VERIFY_EMAIL,
                pass: process.env.VERIFY_EMAIL_PSWD,
            },
        });

        //return the Transporter variable which has the sendMail method to send the mail
        //which is within the mailOptions
        return await Transporter.sendMail(mailOptions)
    } catch (error) {
        console.log(error)
    }
}
