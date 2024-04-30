import { Injectable } from "@angular/core";
import { GestoreServerService } from "src/app/server/gestore-server.service";
import { Metodi } from "src/app/utils/TipiSpeciali";
import Utente from "../tabella-utenti/utente.model";
import { AxiosError } from "axios";
import { Perizia } from "../../perizia/perizia.model";

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

    async ResetImmagine(username: string) {
        return new Promise<void | number>((resolve) => {
            this.server.InviaRichiesta(Metodi.PATCH, "/api/reset-immagine", { username })
            .then(() => resolve())
            .catch((err: AxiosError) => resolve(err.status!));
        });
    }

    async CaricaImmagine(immagine: File, username: string) {
        return new Promise<{url: string} | number>((resolve) => {
            const formData = new FormData();
            formData.append("immagine", immagine);
            formData.append("username", username);

            console.log(immagine)

            this.server.InviaRichiesta(Metodi.POST, "/api/carica-immagine-profilo", formData)
            .then((e) => resolve(e.data))
            .catch((err: AxiosError) => resolve(err.status!));
        });
    }

    async UsernameEsistente(username: string) {
        return new Promise<boolean>((resolve) => {
            this.server.InviaRichiesta(Metodi.GET, "/api/controlla-username", { username })
            .then(() => resolve(true))
            .catch(() => resolve(false));
        });
    }

    PerizieUtente(username: string) {
        return new Promise<Perizia[] | undefined>((resolve) => {
            this.server.InviaRichiesta(Metodi.GET, "/api/perizie-utente", { "codOperatore": username })
            .then((e) => resolve(e.data))
            .catch(() => resolve(undefined));
        });
    }
}