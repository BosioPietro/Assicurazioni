import { Request, Response, NextFunction } from "express";
import { Express } from "express";
import { MongoDriver } from "@bosio/mongodriver";
import { ConfrontaPwd, ControllaToken, GeneraPassword, GeneraCodice, CifraPwd, DecifraToken } from "../encrypt.js";
import { InviaMailNuovaPassword, InviaMailPasswordCambiata, InviaMailRecupero } from "./mail.js";
import { RispondiToken } from "../strumenti.js";
import { DataInStringa, StringaInData } from "../funzioni.js";
import env from "../ambiente.js"
import Twilio from "twilio";

const smsClient = Twilio(env.TWILIO_API_SID, env.TWILIO_API_SECRET)

const RegistraUtente = async (app : Express, driver : MongoDriver) => {
    app.post("/api/registrazione", async (req : Request, res : Response) => {
        const { username, email } = req["body"];
    
        if(driver.Collezione !== "utenti") await driver.SettaCollezione("utenti");

        const [userUtente, userEmail] = await Promise.all([
            driver.PrendiUno({ username }), 
            driver.PrendiUno({ email })
        ])
        if(driver.Errore(userUtente, res) || driver.Errore(userEmail, res)) return;

        if(userUtente) return res.status(400).send("Username già esistente")
        if(userEmail) return res.status(400).send("Email già registrata")
    
        const password = GeneraPassword()
        const d = new Date();
        const inserimento = await driver.Inserisci({ 
            username, 
            email, 
            password : CifraPwd(password), 
            cambioPwd : true, 
            dataCreazione: `${d.getDate().toString().padStart(2, "0")}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getFullYear()}`
        })
        if(driver.Errore(inserimento, res)) return;

        const dataToken = {username, _id : inserimento["insertedId"].toString()}
        
        InviaMailNuovaPassword(username, password, email)
        .then(() => RispondiToken(res, dataToken, { "ok" : "Registrazione effettuata" }))
        .catch(() => res.status(500).send("Errore nell'invio della mail"))
    })
}

const LoginUtente = async (app : Express, driver : MongoDriver) => {
    app.post("/api/login", async (req : Request, res : Response) => {
        const { username: utente, password } = req["body"];
    
        if(driver.Collezione !== "utenti") await driver.SettaCollezione("utenti");

        const tipo = utente.includes("@") ? "email" : "username";
        const user = await driver.PrendiUno({ [tipo] : utente }, { password : 1, cambioPwd : 1, username: 1, "2FA": 1 })
    
        if(driver.Errore(user, res)) return;
        if(!user) return res.status(400).send("Username non esistente") 
    
        if(ConfrontaPwd(password, user["password"]))
        {
            const dataToken: any = { username: user["username"], _id : user["_id"].toString() }
            if(user["admin"] || user["2FA"]){
                dataToken["2FA"] = false;   
            }

            const risposta: Record<string, any> = { "deveCambiare" : user["cambioPwd"] }
            if(user["admin"] || user["2FA"])
            {
                risposta["2FA"] = false;   
            }

            RispondiToken(res, dataToken, risposta)
        }
        else return res.status(401).send("Password errata");
    });   
}

const LoginOAuth = async (app : Express, driver : MongoDriver) => {
    app.post("/api/login-oauth", async (req : Request, res : Response) => {
        const { email } = req["body"];
        
        const regex = new RegExp(`^${email}$`, "i");
        if(driver.Collezione !== "utenti") await driver.SettaCollezione("utenti");

        const user = await driver.PrendiUno({ email : regex });

        if(driver.Errore(user, res)) return;
        if(!user) return res.status(400).send("Utente non autorizzato");

        const dataToken: any = { username: user["username"], _id : user["_id"].toString() }
        if(user["admin"] || user["2FA"]){
            dataToken["2FA"] = false;   
        }

        const risposta: Record<string, any> = { "deveCambiare" : user["cambioPwd"] }
        if(user["admin"] || user["2FA"])
        {
            risposta["2FA"] = false;   
        }

        RispondiToken(res, dataToken, risposta)
    });
}

const CambiaPassword = (app: Express, driver : MongoDriver) => {
    app.post("/api/cambio-password", async (req : Request, res : Response) => {

        const { password } = req["body"];
        const payload = DecifraToken(req.headers["authorization"]!);
        const { username } = payload;

        if(driver.Collezione !== "utenti") await driver.SettaCollezione("utenti");

        const user : any = await driver.PrendiUno({ username })
        if(driver.Errore(user, res)) return;

        delete user["_id"];
        // se il cambio delle password iniziale
        delete user["cambioPwd"]
        // se il cambio password è un recupero
        delete user["recupero"]

        user["password"] = CifraPwd(password);

        const data = await driver.Replace({ username }, user)
        if(driver.Errore(data, res)) return;

        InviaMailPasswordCambiata(user["username"], user["email"])
        .then(() => RispondiToken(res, payload, { "ok" : "Password Cambiata" }))
        .catch(() => RispondiToken(res, payload, `Errore nell'invio della mail`, 500))
    })
}

const RecuperoCredenziali = (app: Express, driver: MongoDriver) =>{
    app.post("/api/recupero-credenziali", async (req: Request, res: Response) => {
        const { email } = req["body"];

        if(driver.Collezione !== "utenti") await driver.SettaCollezione("utenti");
        
        const user = await driver.PrendiUno({ email });
        if(driver.Errore(user, res)) return;
        
        
        const dataToken: any = { username: user["username"], _id : user["_id"].toString() }
        if(user["admin"] || user["2FA"]){
            dataToken["2FA"] = false;   
        }

        if(!user) return RispondiToken(res, dataToken, `User non esistente`, 400)
        delete user["_id"];

        const codice = GeneraCodice();
        const recupero = {
            data: DataInStringa(new Date()),
            codice
        }

        console.log(codice)

        const data = await driver.Replace({ email }, { ...user, recupero })
        if(driver.Errore(data, res)) return;

        InviaMailRecupero(email, user["username"], codice)
        .then(() => RispondiToken(res, dataToken, { "ok" : "Password Cambiata" }))
        .catch(() => RispondiToken(res, dataToken, `Errore nell'invio della mail`, 500))
    })
}

const VerificaRecupero = (app: Express, driver: MongoDriver) => {
    app.get("/api/verifica-recupero", async (req: Request, res: Response) => {
        const payload = DecifraToken(req.headers["authorization"]!)
        const { username } = payload;

        if(driver.Collezione !== "utenti") await driver.SettaCollezione("utenti");

        const user = await driver.PrendiUno({ username });
        if(driver.Errore(user, res)) return;

        if(!user["recupero"])
        {
            RispondiToken(res, payload, `L'utente non deve cambiare la password`, 400)
        }
        else RispondiToken(res, payload, { ris : "ok"})
    })
}

const VerificaCodice = (app: Express, driver: MongoDriver) => {
    app.post("/api/verifica-codice", async (req: Request, res: Response) => {
        const payload = DecifraToken(req.headers["authorization"]!);
        const { username } = payload;
        const { codice } = req["body"]

        const user = await driver.PrendiUno({ username });
        if(driver.Errore(user, res)) return;

        if(!user) return RispondiToken(res, payload, `Utente non esistente`, 400)

        if(!user["recupero"]) return RispondiToken(res, payload, `Recupero non richiesto`, 400)

        const { recupero } = user;
        const oggi = new Date();
        const dataRichiesta = StringaInData(recupero["data"])

        if((oggi.getTime() - dataRichiesta.getTime()) > 60 * 30 * 1000){
            delete user["recupero"]
            delete user["_id"]
            
            const info = await driver.Replace({ username }, user)
            if(driver.Errore(info, res)) return;
            RispondiToken(res, payload, `Tempo scaduto`, 400)
            return;
        }

        if(codice !== recupero["codice"]){
            RispondiToken(res, payload, `Codice errato`, 400)
            return;
        }

        RispondiToken(res, payload, { ris : "ok"})
    })
}

const InviaCodiceTelefono = (app: Express, driver: MongoDriver) => {
    app.post("/api/invia-codice-verifica", async (req: Request, res: Response) => {
        const payload = DecifraToken(req.headers["authorization"]!);
        const { username } = payload;

        const user = await driver.PrendiUno({ username });
        if(driver.Errore(user, res)) return;

        if(!user) return RispondiToken(res, payload, `Utente non esistente`, 400)
        
        if(!user["admin"] && !user["2FA"]){
            RispondiToken(res, payload, `La verifica telefonica è disabilitata per questo utente`, 401)
            return;
        }

        if(user["telefono"]){
            RispondiToken(res, payload, `Numero di telefono non fornito`, 401)
            return;
        }

        const id = await smsClient.verify.v2.services(env.TWILIO_API_KEY).verifications
        .create({to: '+393318233661', channel: 'sms'})
        // const ris: any = await vonage.sms.send({
        //     from: "Vonage APIs",
        //     to: "393318233661",
        //     text: 'A text message sent using the Vonage SMS API',
        // })
        // .catch(err => RispondiToken(res, CreaToken(payload), `Errore interno ${err.message || err.toString()}`, 500))
        // if(!ris) return;

        user["Codice2FA"] = id["sid"];
        delete user["_id"]

        const data = await driver.Replace({ username }, user)
        if(driver.Errore(data, res)) return;

        RispondiToken(res, payload, { ris : "ok"})
    })
}

const VerificaCodiceTelefono = (app: Express, driver: MongoDriver) => {
    app.post("/api/verifica-codice-telefono", async (req: Request, res: Response) => {
        console.log("ciao1")
        const payload = DecifraToken(req.headers["authorization"]!);
        const { username } = payload;
        const { codice } = req["body"];

        console.log("ciao")

        const user = await driver.PrendiUno({ username });
        if(driver.Errore(user, res)) return;

        if(!user) return RispondiToken(res, payload, "Utente non esiste", 400);

        if(!user["Codice2FA"]){
            RispondiToken(res, payload, "Utente non ha richiesto la verifica", 400);
            return;
        }

        if(user["Codice2FA"] == codice)
        {
            payload["2FA"] = true;
            RispondiToken(res, payload, { ris : "ok"})
        }
        else RispondiToken(res, payload, "Codice errato", 401);
    })
}


const LogoutUtente = (app : Express) => {
    app.get("/api/logout", (req : Request, res : Response) => {
        res.send({ "ok" : "Logout effettuato" })
    });
}

const ControlloToken = (app : Express, driver : MongoDriver) => {
    app.get("/api/controllo-token", (req : Request, res : Response) => ControllaToken(driver, req, res));
}

const ControlloTokenMiddleware = (app : Express, driver : MongoDriver) => {
    app.use("/api/", (req : Request, res : Response, next : NextFunction) => ControllaToken(driver, req, res, next));
}

export { 
    RegistraUtente, 
    LoginUtente, 
    LogoutUtente, 
    ControlloToken, 
    ControlloTokenMiddleware, 
    LoginOAuth, 
    CambiaPassword, 
    RecuperoCredenziali, 
    VerificaCodice,
    VerificaRecupero,
    InviaCodiceTelefono,
    VerificaCodiceTelefono
}