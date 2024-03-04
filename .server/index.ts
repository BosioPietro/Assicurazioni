import _http from "http";
import { MongoDriver } from "@bosio/mongodriver";
import express, { Express } from "express";
import { TipoServer } from "./strumenti.js";
import env from "./ambiente.js";

import * as Richieste from "./middleware/base.js";
import * as Cors from "./middleware/cors.js";
import * as Errori from "./middleware/errori.js";
import * as Autenticazione from "./middleware/autenticazione.js";


const app : Express = express();

// APERTURA SERVER
const driver = await MongoDriver.CreaDatabase(env["STR_CONN"], env["DBNAME"]);
const server : TipoServer = _http.createServer(app);

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

