import { Injectable } from '@angular/core';
import { GestoreServerService } from 'src/app/server/gestore-server.service';
import Utente from './tabella-utenti/utente.model';
import { Metodi } from 'src/app/utils/TipiSpeciali';
@Injectable({
  providedIn: 'root'
})
export class UtentiService {
  constructor(private server: GestoreServerService) { }

  AggiornaUtente(u: Utente){
    return this.server.InviaRichiesta(Metodi.POST, "/api/aggiornaUtente", u);
  }
}
