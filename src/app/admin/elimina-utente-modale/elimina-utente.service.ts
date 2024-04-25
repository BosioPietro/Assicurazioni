import { Injectable } from "@angular/core";
import { GestoreServerService } from "src/app/server/gestore-server.service";
import { Metodi } from "src/app/utils/TipiSpeciali";
import Utente from "../utenti/tabella-utenti/utente.model";
import { AxiosError } from "axios";

@Injectable({
    providedIn: 'root',
})

export class EliminaUtenteService {
    constructor(private server: GestoreServerService) { }

    async ModificaUtente(utente: Utente[]) {
        return new Promise<void | number>((resolve) => {
            const username = utente.map(u => u.username);
            this.server.InviaRichiesta(Metodi.DELETE, "/api/utenti", { utenti: username })
            .then(() => resolve())
            .catch((err: AxiosError) => resolve(err.status!));
        });
    }
}