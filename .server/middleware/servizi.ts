import { Express, Request, Response } from "express";
import { MongoDriver } from "@bosio/mongodriver";

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

        if(driver.Collezione != "utenti"){
            await driver.SettaCollezione("utenti");
        }

        const eliminati = await driver.Elimina({ username : { $in : utenti } });
        if(driver.Errore(eliminati, res)) return;

        res.send(eliminati);
    })
}

export { PrendiUtenti, EliminaUtenti };