import bcrypt from 'bcryptjs';
import env from './ambiente.js';
import jwt from 'jsonwebtoken';
import { VerifyErrors } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { MongoDriver } from '@bosio/mongodriver';

const CifraPwd = (password: string): string => bcrypt.hashSync(password, 10);

const ConfrontaPwd = (password: string, hash: string) : boolean => bcrypt.compareSync(password, hash);

const CreaToken = (utente : {username : string, _id? : string, iat? : number}) : string => {
    const secondi = Math.floor(new Date().getTime() / 1000);
    const durata = env["DURATA_TOKEN"];
    
    const payload = {
        iat : utente["iat"] || secondi,
        exp : secondi + durata,
        username : utente["username"],
        _id : utente["_id"]
    }
    
    return jwt.sign(payload, env["ENCRYPTION_KEY"]);
}


const ControllaToken = (req : Request, res : Response, next? : NextFunction) => {
    if(!req.headers["authorization"]) return res.status(403).send("Token non fornito");

    const token = req.headers["authorization"];
    console.log(token)

    jwt.verify(token, env["ENCRYPTION_KEY"], async (err : VerifyErrors | null, payload : any) => {
        if(err) return res.status(500).send("Errore nella verifica del token" + err["message"]);

        const token = CreaToken(payload);

        res.setHeader("authorization", token)
        res.setHeader("access-control-expose-headers", "authorization")
        Object.assign(req, { payload })
        
        if(!next)
        {
            const driver = await MongoDriver.CreaDatabase(env["STR_CONN"], "assicurazioni", "utenti")
            const tipo = payload["username"].includes("@") ? "email" : "username";
            const utente = await driver.PrendiUno({ [tipo] : payload["username"] }, { cambioPwd : 1, dataCreazione : 1 })
            if(!driver.ChkErrore(utente))
            {
                res.send({ 
                    "ok" : "Token valido",
                    "deveCambiare" : !!utente["cambioPwd"],
                    "dataCreazione" : utente["dataCreazione"]
                })
            }
            else res.status(500).send("Errore durante la convalida dell'utente")
        }
        else next();
    })
}

const DecifraToken = (token : string) : any => jwt.decode(token);

const GeneraPwd = () : string => {
    const alfabeto = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numeri = "0123456789";
    const speciali = "!@#$%^&*()_+";

    const caratteri = alfabeto + alfabeto.toLowerCase() + numeri + speciali;
    let pwd = "";
    for(let i = 0; i < 14; i++)
    {
        pwd += caratteri.charAt(Math.floor(Math.random() * caratteri.length));
    }
    
    console.log(pwd)

    return pwd;
}

export { ConfrontaPwd, CreaToken, ControllaToken, GeneraPwd, CifraPwd, DecifraToken }