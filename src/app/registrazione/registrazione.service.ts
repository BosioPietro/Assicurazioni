import { Injectable } from '@angular/core';
import { GestoreServerService } from '../server/gestore-server.service';
import Metodi from '../server/metodi.model';

@Injectable({
  providedIn: 'root'
})
export class RegistrazioneService {

  constructor(private server : GestoreServerService) { }

  public async Registrazione(username : string, email : string, password : string){
    return this.server.InviaRichiesta(Metodi.POST, "/api/registrazione", {username, email, password})
  }
}
