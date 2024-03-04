import { Request, Response, NextFunction } from "express";
import { Express } from "express";
import { MongoDriver } from "@bosio/mongodriver";
import { ConfrontaPwd, CreaToken, ControllaToken, GeneraPwd } from "../encrypt.js";

const RegistraUtente = async (app : Express, driver : MongoDriver) => {
    app.post("/api/registrazione", async (req : Request, res : Response) => {
        const { username, email } = req["body"];
    
        if(driver.Collezione !== "utenti") await driver.SettaCollezione("utenti");
        const data = await driver.PrendiUno({ username })
    
        if(driver.ChkErrore(data)) return res.status(500).send(data["errore"])
        if(data) return res.status(400).send("Username già esistente")
    
        const inserimento = await driver.Inserisci({ username, email, password : GeneraPwd() })
        if(driver.ChkErrore(inserimento)) return res.status(500).send(inserimento["errore"])
    
        const token = CreaToken({username, _id : inserimento["insertedId"].toString()})
        
        res.setHeader("authorization", token)
        res.setHeader("access-control-expose-headers", "authorization")
        res.send({ "ok" : "Registrazione effettuata"})
    })
}

const LoginUtente = async (app : Express, driver : MongoDriver) => {
    app.post("/api/login", async (req : Request, res : Response) => {
        const { username,   password } = req["body"];
    
        if(driver.Collezione !== "utenti") await driver.SettaCollezione("utenti");
        const data = await driver.PrendiUno({ username }, { "password" : 1 })
    
        if(driver.ChkErrore(data)) return res.status(500).send(data["errore"])
        if(!data) return res.status(400).send("Username non esistente") 
    
        if(ConfrontaPwd(password, data["password"]))
        {
            const token = CreaToken({username, _id : data["_id"].toString()})
            res.setHeader("authorization", token)
            res.setHeader("access-control-expose-headers", "authorization")
            res.send({ "ok" : "Login effettuato" })
        }
        else return res.status(401).send("Password errata");
    });
    
}

const LogoutUtente = (app : Express) => {
    app.get("/api/logout", (req : Request, res : Response) => {
        res.setHeader("authorization", "")
        res.setHeader("access-control-expose-headers", "authorization")
        res.send({ "ok" : "Logout effettuato" })
    });
}

const ControlloToken = (app : Express) => {
    app.get("/api/controllo-token", (req : Request, res : Response) => ControllaToken(req, res));
}

const ControlloTokenMiddleware = (app : Express) => {
    app.use("/api/", (req : Request, res : Response, next : NextFunction) => ControllaToken(req, res, next));
}

export { RegistraUtente, LoginUtente, LogoutUtente, ControlloToken, ControlloTokenMiddleware }