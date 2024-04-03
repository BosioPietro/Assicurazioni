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


const ControllaToken = (driver : MongoDriver, req : Request, res : Response, next? : NextFunction) => {
    if(!req.headers["authorization"]) return res.status(403).send("Token non fornito");

    const token = req.headers["authorization"];

    jwt.verify(token, env["ENCRYPTION_KEY"], async (err : VerifyErrors | null, payload : any) => {
        if(err) return res.status(500).send("Errore nella verifica del token: " + err["message"]);

        const token = CreaToken(payload);

        res.setHeader("authorization", token)
        res.setHeader("access-control-expose-headers", "authorization")
        Object.assign(req, { payload })
        
        if(!next)
        {
            await driver.SettaCollezione("utenti")
            const tipo = payload["username"].includes("@") ? "email" : "username";
            const utente = await driver.PrendiUno({ [tipo] : payload["username"] }, { cambioPwd : 1, dataCreazione : 1 })
            if(!driver.Errore(utente))
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

type Token = {iat: number, exp: number, username: string, id? : string}
const DecifraToken = (token : string) => jwt.decode(token) as Token;

const GeneraPassword = () : string => {
    const alfabeto = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numeri = "0123456789";
    const speciali = "!@#$%^&*()_+";

    const caratteri = alfabeto + alfabeto.toLowerCase() + numeri + speciali;
    let pwd = "";
    for(let i = 0; i < 14; i++)
    {
        pwd += caratteri.charAt(Math.floor(Math.random() * caratteri.length));
    }

    return pwd;
}

const GeneraCodice = () => {
    const alfabeto = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numeri = "0123456789";
    const caratteri = alfabeto + numeri;

    let codice = "";
    for(let i = 0; i < 6; ++i){
        codice += caratteri.charAt(Math.floor(Math.random() * caratteri.length))
    }

    return codice;
}

export { ConfrontaPwd, CreaToken, ControllaToken, GeneraPassword, GeneraCodice, CifraPwd, DecifraToken }