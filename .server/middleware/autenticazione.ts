import { Request, Response, NextFunction } from "express";
import { Express } from "express";
import { MongoDriver } from "@bosio/mongodriver";
import { ConfrontaPwd, CreaToken, ControllaToken, GeneraPassword, GeneraCodice, CifraPwd, DecifraToken } from "../encrypt.js";
import { InviaMailNuovaPassword, InviaMailPasswordCambiata, InviaMailRecupero } from "./mail.js";
import { RispondiToken } from "../strumenti.js";
import { DataInStringa, StringaInData } from "../funzioni.js";
import env from "../ambiente.js"
import { Vonage } from "@vonage/server-sdk";
import { Auth } from "@vonage/auth";

const vonage = new Vonage(new Auth({
    apiKey: env.VONAGE_API_KEY,
    apiSecret: env.VONAGE_API_SECRET,
}));

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
    
        const token = CreaToken({username, _id : inserimento["insertedId"].toString()})
        
        InviaMailNuovaPassword(username, password, email)
        .then(() => RispondiToken(res, token, { "ok" : "Registrazione effettuata" }))
        .catch(() => res.status(500).send("Errore nell'invio della mail"))
    })
}

const LoginUtente = async (app : Express, driver : MongoDriver) => {
    app.post("/api/login", async (req : Request, res : Response) => {
        const { username: utente, password } = req["body"];
    
        if(driver.Collezione !== "utenti") await driver.SettaCollezione("utenti");

        const tipo = utente.includes("@") ? "email" : "username";
        const user = await driver.PrendiUno({ [tipo] : utente }, { password : 1, cambioPwd : 1, username: 1 })
    
        if(driver.Errore(user, res)) return;
        if(!user) return res.status(400).send("Username non esistente") 
    
        if(ConfrontaPwd(password, user["password"]))
        {
            const token = CreaToken({username: user["username"], _id : user["_id"].toString()})
            RispondiToken(res, token, { "ok" : "Login Effettuato", "deveCambiare" : user["cambioPwd"]})
        }
        else return res.status(401).send("Password errata");
    });   
}

const LoginOAuth = async (app : Express, driver : MongoDriver) => {
    app.post("/api/login-oauth", async (req : Request, res : Response) => {
        const { email } = req["body"];
        
        const regex = new RegExp(`^${email}$`, "i");
        if(driver.Collezione !== "utenti") await driver.SettaCollezione("utenti");

        const user = await driver.PrendiUno({ email : regex }) as any;

        if(driver.Errore(user, res)) return;
        if(!user) return res.status(400).send("Utente non autorizzato");

        RispondiToken(res, CreaToken(user), { "ok" : "Login effettuato" });
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
        .then(() => RispondiToken(res, CreaToken(user), { "ok" : "Password Cambiata" }))
        .catch(() => res.status(500).send("Errore nell'invio della mail"))
    })
}

const RecuperoCredenziali = (app: Express, driver: MongoDriver) =>{
    app.post("/api/recupero-credenziali", async (req: Request, res: Response) => {
        const { email } = req["body"];

        if(driver.Collezione !== "utenti") await driver.SettaCollezione("utenti");
        
        const user = await driver.PrendiUno({ email }) as any;
        if(driver.Errore(user, res)) return;

        if(!user)return res.status(400).send("User non esistente")
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
        .then(() => RispondiToken(res, CreaToken(user), { "ok" : "Password Cambiata" }))
        .catch(() => res.status(500).send("Errore nell'invio della mail"))
    })
}

const VerificaRecupero = (app: Express, driver: MongoDriver) => {
    app.get("/api/verifica-recupero", async (req: Request, res: Response) => {
        const payload = DecifraToken(req.headers["authorization"]!)
        const { username } = payload;

        if(driver.Collezione !== "utenti") await driver.SettaCollezione("utenti");

        const user = await driver.PrendiUno({ username }) as any;
        if(driver.Errore(user, res)) return;

        if(!user["recupero"])
        {
            res.status(405).send("L'Utente non deve cambiare la password");
        }
        else RispondiToken(res, CreaToken(user), { ris : "ok"})
    })
}

const VerificaCodice = (app: Express, driver: MongoDriver) => {
    app.post("/api/verifica-codice", async (req: Request, res: Response) => {
        const payload = DecifraToken(req.headers["authorization"]!);
        const { username } = payload;
        const { codice } = req["body"]

        const user = await driver.PrendiUno({ username }) as any;
        if(driver.Errore(user, res)) return;

        if(!user) return res.status(400).send("Mail non esistente")

        if(!user["recupero"])return res.status(401).send("Recupero non richiesto");

        const { recupero } = user;
        const oggi = new Date();
        const dataRichiesta = StringaInData(recupero["data"])

        if((oggi.getTime() - dataRichiesta.getTime()) > 60 * 30 * 1000){
            delete user["recupero"]
            delete user["_id"]
            
            const info = await driver.Replace({ username }, user)
            if(driver.Errore(info, res)) return;
            res.status(402).send("Tempo scaduto")
            return;
        }

        if(codice !== recupero["codice"]){
            res.status(403).send("Codice errato")
            return;
        }

        RispondiToken(res, CreaToken(user), { ris : "ok"})
    })
}

const InviaCodiceTelefono = (app: Express, driver: MongoDriver) => {
    app.post("/api/invia-codice-verifica", async (req: Request, res: Response) => {
        const payload = DecifraToken(req.headers["authorization"]!);
        const { username } = payload;

        const user = await driver.PrendiUno({ username }) as any;
        if(driver.Errore(user, res)) return;

        if(!user) return res.status(400).send("Utente non esistente")
        
        if(!user["admin"] && !user["2FA"]){
            res.status(400).send("La verifica telefonica è disabilitata per questo utente")
            return;
        }

        if(user["telefono"]){
            res.status(401).send("Numero di telefono non fornito")
            return;
        }

        const ris: any = await vonage.verify.start({
            number: "393318233661",
            brand: "Rilievi e Perizie"
          })
        .catch(err => res.status(500).send(`Errore interno ${err.message || err.toString()}`))
        if(!ris) return;

        user["idVerificaTelefonica"] = ris.request_id;
        delete user["_id"]

        const data = await driver.Replace({ username }, user)
        if(driver.Errore(data, res)) return;

        RispondiToken(res, CreaToken(user), { ris : "ok"})
    })
}

const VerificaCodiceTelefono = (app: Express, driver: MongoDriver) => {
    app.post("/api/verifica-codice-telefono", async (req: Request, res: Response) => {
        const payload = DecifraToken(req.headers["authorization"]!);
        const { username } = payload;
        const { codice } = req["body"];

        const user = await driver.PrendiUno({ username }) as any;
        if(driver.Errore(user, res)) return;

        if(!user) return res.status(400).send("Utente non esistente")

        if(!user["idVerificaTelefonica"]){
            res.status(400).send("L'utente non ha richiesto nessun codice")
            return;
        }

        vonage.verify.check(user["idVerificaTelefonica"], codice)
        .then(resp => console.log(resp))
        .catch(err => console.error(err));


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
    VerificaRecupero 
}