import { Injectable } from "@angular/core";
import { GestoreServerService } from "src/app/server/gestore-server.service";
import { Metodi } from "src/app/utils/TipiSpeciali";
import Utente from "../utenti/tabella-utenti/utente.model";

@Injectable({
    providedIn: 'root'
})
export class HomeService {
    constructor(private server: GestoreServerService) { }

    ConfigurazioniGrafici() {
        return new Promise<Record<string, any>[] | undefined>((resolve) => {
            this.server.InviaRichiesta(Metodi.GET, '/api/configurazioni-grafici')
            .then((res) => resolve(res["data"]))
            .catch(() => resolve(undefined));
        });
    }
    
    PrendiUtenti(){
        return new Promise<Utente[] | undefined>((resolve) => {
            this.server.InviaRichiesta(Metodi.GET, '/api/utenti')
            .then((res) => {
                let r = res["data"].map((u: any) => Object.assign(u, { attivo: u.attivo == 'true'})) as any[];

                r = r.sort((a, b) => b.attivo - a.attivo);
                
                if(r.length > 5)
                {
                    resolve(r.slice(0, 5));
                }
                else resolve(r);
            })
            .catch(() => resolve(undefined));
        });
    }
}