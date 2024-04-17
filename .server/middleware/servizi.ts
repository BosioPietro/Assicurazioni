import { Express, Request, Response } from "express";
import { MongoDriver } from "@bosio/mongodriver";

const PrendiUtenti = (app: Express, driver: MongoDriver) => {
    app.get("/api/utenti", async (req: Request, res: Response) => {
        const filtri = req.query || {};
        console.log("filtri")

        if(driver.Collezione != "utenti"){
            await driver.SettaCollezione("utenti");
        }

        const utenti = await driver.PrendiMolti(filtri);
        if(driver.Errore(utenti, res)) return;

        utenti.forEach((u: any) => { delete u["_id"] })

        res.send(utenti);

    })
}

export { PrendiUtenti };