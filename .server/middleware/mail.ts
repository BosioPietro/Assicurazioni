import nodemailer from 'nodemailer';
import env from '../ambiente.js';
import { Response } from 'express';
import fs from 'fs';

const auth = {
    user: env["MAILUSER"],
    pass: env["MAILPWD"]
};

const transporter = nodemailer.createTransport({
    service : "gmail",
    auth : auth
})

type MailOptions = {
    from: string,
    to: string,
    subject: string,
    html: string,
    attachments?: Array<{filename: string, path: string}>

}


const body : string = fs.readFileSync("./middleware/mail.html").toString();

const InviaMail = (opzioni : MailOptions) => new Promise((resolve, reject) => {
    transporter.sendMail(opzioni, (err : Error | null) => {
        if (err)
        {
            reject(err);
        }
        else resolve("Mail inviata");
    })
});

const InviaMailPassword = async (username : string, password : string, email : string) => {
    const opzioni : MailOptions = {
        from: env["MAILUSER"],
        to: email,
        subject: "Registrazione effettuata",
        html: body.replace("${username}", username).replace("${password}", password)
    }
    return InviaMail(opzioni);
}

export { InviaMailPassword }