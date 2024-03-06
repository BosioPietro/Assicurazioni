import { Request, Response, NextFunction } from "express";
import { Express } from "express";
import { MongoDriver } from "@bosio/mongodriver";
import { ConfrontaPwd, CreaToken, ControllaToken, GeneraPwd, CifraPwd, DecifraToken } from "../encrypt.js";
import { InviaMailPassword } from "./mail.js";
import { RispondiToken } from "../strumenti.js";
import env from "../ambiente.js";

const RegistraUtente = async (app : Express, driver : MongoDriver) => {
    app.post("/api/registrazione", async (req : Request, res : Response) => {
        const { username, email } = req["body"];
    
        if(driver.Collezione !== "utenti") await driver.SettaCollezione("utenti");
        const data = await driver.PrendiUno({ username })
    
        if(driver.ChkErrore(data)) return res.status(500).send(data["errore"])
        if(data) return res.status(400).send("Username già esistente")
    
        const password = GeneraPwd()
        const inserimento = await driver.Inserisci({ username, email, password : CifraPwd(password) })
        if(driver.ChkErrore(inserimento)) return res.status(500).send(inserimento["errore"])
    
        const token = CreaToken({username, _id : inserimento["insertedId"].toString()})
        
        InviaMailPassword(username, password, email)
        .then(() => RispondiToken(res, token, { "ok" : "Registrazione effettuata" }))
        .catch(() => res.status(500).send("Errore nell'invio della mail"))
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
            RispondiToken(res, token, { "ok" : "Login Effettuato" })
        }
        else return res.status(401).send("Password errata");
    });   
}

const LoginGoogle = async (app : Express, driver : MongoDriver) => {
    app.post("/api/login-google", async (req : Request, res : Response) => {
        if(!req.headers["authorization"])
        {
            res.status(403).send("Token non fornito");
            return;
        }

        const token = req.headers["authorization"];
        const payload = DecifraToken(token);
        const regex = new RegExp(`^${payload["username"]}$`, "i");

        if(driver.Collezione !== "utenti") await driver.SettaCollezione("utenti");

        const user = await driver.PrendiUno({ email : regex }) as any;
        if(driver.ChkErrore(user)) return res.status(500).send(user["errore"]);
        if(!user) return res.status(400).send("Utente non autorizzato");

        RispondiToken(res, CreaToken(user), { "ok" : "Login effettuato" });
    });

}

const LogoutUtente = (app : Express) => {
    app.get("/api/logout", (req : Request, res : Response) => {
        res.send({ "ok" : "Logout effettuato" })
    });
}

const ControlloToken = (app : Express) => {
    app.get("/api/controllo-token", (req : Request, res : Response) => ControllaToken(req, res));
}

const ControlloTokenMiddleware = (app : Express) => {
    app.use("/api/", (req : Request, res : Response, next : NextFunction) => ControllaToken(req, res, next));
}

export { RegistraUtente, LoginUtente, LogoutUtente, ControlloToken, ControlloTokenMiddleware, LoginGoogle }