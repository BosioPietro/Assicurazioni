import { Injectable } from '@angular/core';
import { GestoreServerService } from 'src/app/server/gestore-server.service';
import { Metodi } from 'src/app/utils/TipiSpeciali';

@Injectable({
  providedIn: 'root'
})
export class VerificaService {
    constructor(private server: GestoreServerService){}

    public InviaCodice(){
        return this.server.InviaRichiesta(Metodi.POST, "/api/invia-codice-verifica")
    }

    public VerificaCodice(codice: string){
        return this.server.InviaRichiesta(Metodi.POST, "/api/verifica-codice-telefono", { codice })
    }
}