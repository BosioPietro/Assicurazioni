import { Express, Request, Response } from "express";
import { MongoDriver } from "@bosio/mongodriver";
import { DecifraToken, ControllaAdmin } from "../encrypt.js";

const PrendiUtenti = (app: Express, driver: MongoDriver) => {
    app.get("/api/utenti", async (req: Request, res: Response) => {
        const filtri = req.query || {};

        if(driver.Collezione != "utenti"){
            await driver.SettaCollezione("utenti");
        }

        const utenti = await driver.PrendiMolti(filtri);
        if(driver.Errore(utenti, res)) return;

        utenti.forEach((u: any) => { delete u["_id"] })

        res.send(utenti);

    })
}

const EliminaUtenti = (app: Express, driver: MongoDriver) => {
    app.delete("/api/utenti", async (req: Request, res: Response) => {
        const { utenti } = req.body;
        const token = DecifraToken(req.headers.authorization!);

        if(!(await ControllaAdmin(token, driver, res))) return;

        if(driver.Collezione != "utenti"){
            await driver.SettaCollezione("utenti");
        }

        const eliminati = await driver.Elimina({ username : { $in : utenti } });
        if(driver.Errore(eliminati, res)) return;

        res.send(eliminati);
    })
}

const AggiornaUtente = (app: Express, driver: MongoDriver) => {
    app.post("/api/aggiornaUtente", async (req: Request, res: Response) => {
        const utente = req.body;
        const token = DecifraToken(req.headers.authorization!);

        if(!(await ControllaAdmin(token, driver, res))) return;

        if(driver.Collezione != "utenti"){
            await driver.SettaCollezione("utenti");
        }

        delete utente["_id"];

        const aggiornato = await driver.Replace({ username : utente.username }, utente);
        if(driver.Errore(aggiornato, res)) return;

        res.send(aggiornato);
    })
}

export { PrendiUtenti, EliminaUtenti, ControllaAdmin, AggiornaUtente };