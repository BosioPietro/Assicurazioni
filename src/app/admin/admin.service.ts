import { Injectable } from "@angular/core";
import { GestoreServerService } from "../server/gestore-server.service";
import Utente from "./utenti/tabella-utenti/utente.model";
import { Metodi } from "../utils/TipiSpeciali";

@Injectable({
    providedIn: 'root'
})
export class AdminService{
    
    constructor(private server: GestoreServerService){}

    utente?: Utente
    
    PrendiInfoUtente(){
        return new Promise<Utente | undefined>((resolve, reject) => {
            this.server.InviaRichiesta(Metodi.GET, "/api/info-utente")
            .then((res: any) => resolve(res["data"] as Utente))
            .catch((err: any) => reject(undefined))
        })
    }
}