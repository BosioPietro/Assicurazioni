import { Injectable } from "@angular/core";
import { GestoreServerService } from "src/app/server/gestore-server.service";
import { Metodi } from "src/app/utils/TipiSpeciali";

@Injectable({
    providedIn: 'root'
})
export class RecuperoCredenzialiService {

    constructor(private server: GestoreServerService){}

    public InviaMailRecupero(email: string){
        return this.server.InviaRichiesta(Metodi.POST, "/api/recupero-credenziali", { email });
    }

    public VerificaCodice(codice: string){
        return this.server.InviaRichiesta(Metodi.POST, "/api/verifica-codice", { codice })
    }
}