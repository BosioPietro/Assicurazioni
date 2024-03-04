import bcrypt from 'bcryptjs';
import env from './ambiente.js';
import jwt from 'jsonwebtoken';
import { VerifyErrors } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';


const CifraPwd = (password: string): string => bcrypt.hashSync(password, 10);

const ConfrontaPwd = (password: string, hash: string) : boolean => bcrypt.compareSync(password, hash);

const CreaToken = (utente : {username : string, _id : string, iat? : number}) : string => {
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

    jwt.verify(token, env["ENCRYPTION_KEY"], (err : VerifyErrors | null, payload : any) => {
        if(err) return res.status(500).send("Errore nella verifica del token");

        const token = CreaToken(payload);

        res.setHeader("authorization", token)
        res.setHeader("access-control-expose-headers", "authorization")
        Object.assign(req, { payload })
        
        if(!next)
        {
            res.send({ "ok" : "Token valido" })
        }
        else next();
    })
}

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

    return CifraPwd(pwd);
}

export { ConfrontaPwd, CreaToken, ControllaToken, GeneraPwd }