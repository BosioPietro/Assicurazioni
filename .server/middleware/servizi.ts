import { Express, Request, Response } from "express";
import { MongoDriver } from "@bosio/mongodriver";
import { DecifraToken, ControllaAdmin } from "../encrypt.js";
import { CaricaImmagine } from "../funzioni.js";
import { RispondiToken } from "../strumenti.js";
import { UploadApiResponse } from "cloudinary";
import { env } from "process";

const PrendiUtenti = (app: Express, driver: MongoDriver) => {
    app.get("/api/utenti", async (req: Request, res: Response) => {
        const filtri = req.query || {};

        await driver.SettaCollezione("utenti");

        const utenti = await driver.PrendiMolti(filtri);
        if(driver.Errore(utenti, res)) return;

        utenti.forEach((u: any) => { delete u["_id"] })

        RispondiToken(res, DecifraToken(req.headers.authorization!), utenti)
    })
}

const EliminaUtenti = (app: Express, driver: MongoDriver) => {
    app.delete("/api/utenti", async (req: Request, res: Response) => {
        const { utenti } = req.body;
        const token = DecifraToken(req.headers.authorization!);

        if(!(await ControllaAdmin(token, driver, res))) return;

        await driver.SettaCollezione("utenti");

        const eliminati = await driver.Elimina({ username : { $in : utenti } });
        if(driver.Errore(eliminati, res)) return;

        RispondiToken(res, token, eliminati)
    })
}

const AggiornaUtente = (app: Express, driver: MongoDriver) => {
    app.patch("/api/aggiorna-utente", async (req: Request, res: Response) => {
        const utente = req.body;
        const token = DecifraToken(req.headers.authorization!);

        if(!(await ControllaAdmin(token, driver, res))) return;

        await driver.SettaCollezione("utenti");

        delete utente["_id"];

        const aggiornato = await driver.Replace({ username : utente.username }, utente);
        if(driver.Errore(aggiornato, res)) return;

        RispondiToken(res, token, aggiornato)
    })
}

const CaricaImmagineProfilo = (app: Express, driver: MongoDriver) => {
    app.post("/api/carica-immagine-profilo", async (req: Request, res: Response) => {
        const { username } = req.body;
        const immagine: File = (req as any).files["immagine"];

        const token = DecifraToken(req.headers.authorization!)

        await driver.SettaCollezione("utenti");

        const utente = await driver.PrendiUno({ username });
        if(driver.Errore(utente, res)) return;

        let caricata = await CaricaImmagine(immagine);

        if(caricata["errore"]){
            res.status(500).send(caricata["errore"]);
            return;
        }
        else caricata = caricata as UploadApiResponse;

        utente["pfp"] = caricata["secure_url"];

        const aggiornato = await driver.Replace({ username }, utente);
        if(driver.Errore(aggiornato, res)) return;

        RispondiToken(res, token, {url : caricata["secure_url"]})
    })
}

const ResetImmagineProfilo = (app: Express, driver: MongoDriver) => {
    app.patch("/api/reset-immagine", async (req: Request, res: Response) => {
        const { username } = req.body;
        const token = DecifraToken(req.headers.authorization!);

        await driver.SettaCollezione("utenti");

        const utente = await driver.PrendiUno({ username });
        if(driver.Errore(utente, res)) return;

        utente["pfp"] = "";

        const aggiornato = await driver.Replace({ username }, utente);
        if(driver.Errore(aggiornato, res)) return;

        RispondiToken(res, token, aggiornato)
    })
}

const AggiungiUtente = (app: Express, driver: MongoDriver) => {
    app.post("/api/utenti", async (req: Request, res: Response) => {
        const utente = req.body;
        const token = DecifraToken(req.headers.authorization!);

        if(!(await ControllaAdmin(token, driver, res))) return;

        await driver.SettaCollezione("utenti");

        const aggiunto = await driver.Inserisci(utente);
        if(driver.Errore(aggiunto, res)) return;

        RispondiToken(res, token, aggiunto)
    })
}

const PrendiPerizie = (app: Express, driver: MongoDriver) => {
    app.get("/api/perizie", async (req: Request, res: Response) => {
        const filtri = req.query || {};

        await driver.SettaCollezione("perizie");

        const perizie = await driver.PrendiMolti(filtri);
        if(driver.Errore(perizie, res)) return;

        RispondiToken(res, DecifraToken(req.headers.authorization!), perizie)
    })
}

const PrendiPerizia = (app: Express, driver: MongoDriver) => {
    app.get("/api/perizia/:idPerizia", async (req: Request, res: Response) => {
        const { idPerizia } = req["params"];

        await driver.SettaCollezione("perizie");

        const perizia = await driver.PrendiUno({ codice : +idPerizia });
        if(driver.Errore(perizia, res)) return;

        RispondiToken(res, DecifraToken(req.headers.authorization!), perizia)
    })
}

const PrendiOperatore = (app: Express, driver: MongoDriver) => {
    app.get("/api/operatore/:codOperatore", async (req: Request, res: Response) => {
        const { codOperatore } = req["params"];

        await driver.SettaCollezione("utenti");

        const operatore = await driver.PrendiUno({ username : codOperatore });
        if(driver.Errore(operatore, res)) return;

        RispondiToken(res, DecifraToken(req.headers.authorization!), { nome : `${operatore["cognome"]} ${operatore["nome"]}` })
    })
}

const PrendiOperatori = (app: Express, driver: MongoDriver) => {
    app.get("/api/operatori", async (req: Request, res: Response) => {
        await driver.SettaCollezione("utenti");

        const operatori = await driver.PrendiMolti({ ruolo : { $in : [new RegExp("admin", "i"), new RegExp("dipendente", "i")]} });
        if(driver.Errore(operatori, res)) return;

        RispondiToken(res, DecifraToken(req.headers.authorization!), operatori)
    })

}

const EliminaPerizia = (app: Express, driver: MongoDriver) => {
    app.delete("/api/perizia/:idPerizia", async (req: Request, res: Response) => {
        const { idPerizia } = req["params"];
        const token = DecifraToken(req.headers.authorization!);

        if(!(await ControllaAdmin(token, driver, res))) return;

        await driver.SettaCollezione("perizie");

        const eliminata = await driver.Elimina({ codice : +idPerizia });
        if(driver.Errore(eliminata, res)) return;

        RispondiToken(res, token, eliminata)
    })
}

const PrendiIndirizzi = (app: Express) => {
    app.get("/api/indirizzi", async (req: Request, res: Response) => {
        const { valore } = req.query;

        const richiesta = `https://maps.googleapis.com/maps/api/place/autocomplete/json` +
                          `?input=${encodeURI(valore as string)}` +
                          `&locationbias=ipbias` +
                          `&language=it` +
                          `&types=geocode` +
                          `&key=${env["GOOGLE_PLACES_API_KEY"]}`;

        const risposta = await fetch(richiesta);
        const dati = await risposta.json();

        res.send(dati)
    })
}

const IndirizzoDaCoordinate = (app: Express) => {
    app.get("/api/geocode-coordinate", async (req: Request, res: Response) => {
        const { lat, lng } = req.query;

        const richiesta = `https://maps.googleapis.com/maps/api/geocode/json` +
                          `?latlng=${lat},${lng}` +
                          `&key=${env["GOOGLE_PLACES_API_KEY"]}`;

        const risposta = await fetch(richiesta);
        const dati = await risposta.json();

        res.send(dati)
    })
}

const ModificaPerizia = (app: Express, driver: MongoDriver) => {
    app.patch("/api/perizia", async (req: Request, res: Response) => {
        const perizia = req.body;
        const token = DecifraToken(req.headers.authorization!);

        if(!(await ControllaAdmin(token, driver, res))) return;

        await driver.SettaCollezione("perizie");

        delete perizia["_id"];
        delete perizia["nomeOperatore"];

        const aggiornata = await driver.Replace({ codice : perizia.codice }, perizia);
        if(driver.Errore(aggiornata, res)) return;

        RispondiToken(res, token, aggiornata)
    })
}

const CaricaImmaginePerizia = (app: Express) => {
    app.post("/api/carica-immagine-perizia", async (req: Request, res: Response) => {
        const immagine: File = (req as any).files["immagine"];

        const caricata = await CaricaImmagine(immagine);

        if(caricata["errore"]){
            res.status(500).send(caricata["errore"]);
            return;
        }
        else res.send(caricata)
    })

}

export { PrendiUtenti, EliminaUtenti, ControllaAdmin, AggiornaUtente, 
         CaricaImmagineProfilo, ResetImmagineProfilo, AggiungiUtente,
         PrendiPerizia, PrendiOperatore, EliminaPerizia, PrendiIndirizzi,
         IndirizzoDaCoordinate, ModificaPerizia, CaricaImmaginePerizia,
         PrendiOperatori, PrendiPerizie};