import { Injectable } from "@angular/core";
import { GestoreServerService } from "src/app/server/gestore-server.service";
import { Metodi } from "src/app/utils/TipiSpeciali";

@Injectable({
    providedIn: 'root'
})
export class HomeService {
    constructor(private server: GestoreServerService) { }

    async ConfigurazioniGrafici() {
        return new Promise<Record<string, any>[] | undefined>((resolve) => {
            this.server.InviaRichiesta(Metodi.GET, '/api/configurazioni-grafici')
            .then((res) => resolve(res["data"]))
            .catch(() => resolve(undefined));
        });
    }
        
}