import nodemailer, { SentMessageInfo } from 'nodemailer';
import env from '../ambiente.js';
import { Express, Request, Response } from 'express';

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

const InviaMail = (app : Express, opzioni : MailOptions) => {
    app.post('/api/newMail', (req : Request, res : Response) => {
        transporter.sendMail(opzioni, (err : Error | null) => {
            if (err) {
                res.status(500).send("Errore invio mail\n" + err.message);
            }
            else {
                console.log("Email inviata correttamente");
                res.send({ "ris": "OK" });
            }
        })
    });
}

export { InviaMail, MailOptions }