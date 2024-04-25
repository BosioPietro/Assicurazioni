import { Injectable } from "@angular/core";
import { GestoreServerService } from "src/app/server/gestore-server.service";
import { Metodi } from "src/app/utils/TipiSpeciali";
import Utente from "../utenti/tabella-utenti/utente.model";
import { AxiosError } from "axios";

@Injectable({
    providedIn: 'root',
})

export class ModificaUtenteService {
    constructor(private server: GestoreServerService) { }

    async ModificaUtente(utente: Utente) {
        return new Promise<void | number>((resolve) => {
            this.server.InviaRichiesta(Metodi.PATCH, "/api/aggiorna-utente", utente)
            .then(() => resolve())
            .catch((err: AxiosError) => resolve(err.status!));
        });
    }
}