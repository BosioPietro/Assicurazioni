import https from "https";
import { MongoDriver } from "@bosio/mongodriver";
import express, { Express } from "express";
import env from "./ambiente.js";
import { ReadFileAsync } from "./strumenti.js";

import * as Richieste from "./middleware/base.js";
import * as Cors from "./middleware/cors.js";
import * as Errori from "./middleware/errori.js";
import * as Autenticazione from "./middleware/autenticazione.js";
import * as Servizi from "./middleware/servizi.js";

// APERTURA SERVER
const app : Express = express();

const [cert, key, driver] = await Promise.all([
    ReadFileAsync("./keys/certificate.crt"),
    ReadFileAsync("./keys/private_key.pem"),
    MongoDriver.CreaDatabase(env["STR_CONN"], env["DB_NAME"], "utenti")
]);

const server = https.createServer({key, cert}, app);

server.listen(env["PORTA"], () => console.log("Server Avviato"));


/* MIDDLEWARE */

// gestione delle richieste
Richieste.LoggingRichieste(app);
Richieste.MiddlewareJson(app);
Richieste.MiddlewareBodyParser(app);
Richieste.MiddlewareLogParametri(app);
Richieste.MiddlewareFormData(app);

// gestione cors
Cors.MiddlewareCors(app);

// gestione autenticazione
Autenticazione.RegistraUtente(app, driver);
Autenticazione.LoginUtente(app, driver);
Autenticazione.LoginOAuth(app, driver);
Autenticazione.LogoutUtente(app);
Autenticazione.CambiaPassword(app, driver);
Autenticazione.RecuperoCredenziali(app, driver);
Autenticazione.VerificaCodice(app, driver);
Autenticazione.ControllaUsername(app, driver);
Autenticazione.ControlloToken(app, driver);
Autenticazione.ControlloTokenMiddleware(app, driver);
Autenticazione.VerificaRecupero(app, driver);
Autenticazione.InviaCodiceTelefono(app, driver);
Autenticazione.VerificaCodiceTelefono(app, driver);

// gestione servizi
Servizi.PrendiUtenti(app, driver);
Servizi.EliminaUtenti(app, driver);
Servizi.AggiornaUtente(app, driver);
Servizi.CaricaImmagineProfilo(app, driver);
Servizi.ResetImmagineProfilo(app, driver);
Servizi.AggiungiUtente(app, driver);
Servizi.PrendiPerizia(app, driver);
Servizi.PrendiOperatore(app, driver);
Servizi.EliminaPerizia(app, driver);
Servizi.PrendiIndirizzi(app);
Servizi.IndirizzoDaCoordinate(app);
Servizi.ModificaPerizia(app, driver);
Servizi.CaricaImmaginePerizia(app);
Servizi.PrendiOperatori(app, driver);
Servizi.PrendiPerizie(app, driver);

// gestione errori
Errori.LoggingErrori(app);
Errori.GestioneErrori(app);

