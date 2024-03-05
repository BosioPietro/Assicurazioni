import https from "https";
import { MongoDriver } from "@bosio/mongodriver";
import express, { Express } from "express";
import env from "./ambiente.js";
import fs from "fs";

import * as Richieste from "./middleware/base.js";
import * as Cors from "./middleware/cors.js";
import * as Errori from "./middleware/errori.js";
import * as Autenticazione from "./middleware/autenticazione.js";

// APERTURA SERVER
const app : Express = express();

const [cert, key] = [
    fs.readFileSync("./keys/certificate.crt"),
    fs.readFileSync("./keys/private_key.pem")
];

const driver = await MongoDriver.CreaDatabase(env["STR_CONN"], env["DBNAME"]);
const server = https.createServer({key, cert}, app);

server.listen(env["PORTA"], () => console.log("Server Avviato"));


/* MIDDLEWARE */

// gestione delle richieste
Richieste.LoggingRichieste(app);
Richieste.MiddlewareJson(app);
Richieste.MiddlewareBodyParser(app);
Richieste.MiddlewareLogParametri(app);

// gestione cors
Cors.MiddlewareCors(app);

// gestione autenticazione
Autenticazione.RegistraUtente(app, driver);
Autenticazione.LoginUtente(app, driver);
Autenticazione.LogoutUtente(app);
Autenticazione.ControlloToken(app);
Autenticazione.ControlloTokenMiddleware(app);

// gestione errori
Errori.LoggingErrori(app);
Errori.GestioneErrori(app);

