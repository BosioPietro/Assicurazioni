import _http from "http";
import _cors from "cors";
import { MongoDriver } from "@bosio/mongodriver";
import _express, {Express, Request, Response, NextFunction} from "express";
import { TipoServer, CorsAperto } from "./strumenti.js";
import env from "./ambiente.js";
import {CifraPwd, ConfrontaPwd, CreaToken, ControllaToken} from "./encrypt.js";
import { VerifyErrors, verify }  from "jsonwebtoken";
import jwt from "jsonwebtoken";

const app : Express = _express();

// APERTURA SERVER
const driver = await MongoDriver.CreaDatabase(env["STR_CONN"], env["DBNAME"]);
const server : TipoServer = _http.createServer(app);

server.listen(env["PORTA"], () => console.log("Server Avviato"));

// MIDDLEWARE

/*  1. Logging Richieste  */
app.use("/", (req : Request, res : Response, next : NextFunction) => {
    console.log(`>--> ${req.method} ${req.originalUrl}`)
    next();
})

// 3. Lettura dei parametri POST di req["body"] (bodyParser)
app.use("/", _express.json({ "limit": "50mb" }));
app.use("/", _express.urlencoded({ "limit": "50mb", "extended": true }));

/*  4. Log dei paramatri, GET, POST, PUT, PATCH*/
app.use("/", (req : Request, res : Response, next : NextFunction) => {

    const Vuoto = (o : object) : boolean => !Object.keys(o).length;

    if(!Vuoto(req["query"]))
    {
        console.log(`    ${JSON.stringify(req["query"])}`)
    }
    else if(!Vuoto(req["body"]))
    {
        console.log(`    ${JSON.stringify(req["body"])}`)
    }
    next();
}) 

/*  5. CORS */
const whitelist : string[] = [
    "http://localhost:3000",
    "http://localhost:4200",
    "http://localhost:3001",
    "http://localhost:8080",
    "http://127.0.0.1:5500",
    "https://bosio-crud-server.onrender.com"
]
const corsOptions = {
    origin: CorsAperto,
    credentials: true
};
app.use("/", _cors(corsOptions));


// ROUTE FINALI
app.post("/api/registrazione", async (req : Request, res : Response) => {
    const { username, email, password } = req["body"];

    if(driver.Collezione !== "utenti") await driver.SettaCollezione("utenti");
    const data = await driver.PrendiUno({ username })

    if(driver.ChkErrore(data)) return res.status(500).send(data["errore"])
    if(data) return res.status(400).send("Username già esistente")

    const pwdCifrata = CifraPwd(password);
    const inserimento = await driver.Inserisci({ username, email, password : pwdCifrata })
    if(driver.ChkErrore(inserimento)) return res.status(500).send(inserimento["errore"])

    const token = CreaToken({username, _id : inserimento["insertedId"].toString()})
    
    res.setHeader("authorization", token)
    res.setHeader("access-control-expose-headers", "authorization")
    res.send({ "ok" : "Registrazione effettuata"})
})

app.post("/api/login", async (req : Request, res : Response) => {
    const { username, password } = req["body"];

    if(driver.Collezione !== "utenti") await driver.SettaCollezione("utenti");
    const data = await driver.PrendiUno({ username }, { "password" : 1 })

    if(driver.ChkErrore(data)) return res.status(500).send(data["errore"])
    if(!data) return res.status(400).send("Username non esistente")

    console.log(data["password"], password, ConfrontaPwd(password, data["password"]))

    if(ConfrontaPwd(password, data["password"]))
    {
        const token = CreaToken({username, _id : data["_id"].toString()})
        res.setHeader("authorization", token)
        res.setHeader("access-control-expose-headers", "authorization")
        res.send({ "ok" : "Login effettuato" })
    }
    else return res.status(400).send("Password errata");
});

app.get("/api/controllo-token", (req : Request, res : Response) => ControllaToken(req, res));

app.use("/api/", (req : Request, res : Response, next : NextFunction) => ControllaToken(req, res, next));

/*  GESTIONE ERRORI  */
app.use("/", (req : Request, res : Response, next : NextFunction) => res.status(404).send("Api non trovata"));

app.use("/", (err: Error, req : Request, res : Response, next : NextFunction) => console.log("*** ERRORE SERVER ***", err.stack))