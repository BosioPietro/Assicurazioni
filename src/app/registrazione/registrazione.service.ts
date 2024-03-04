import { Injectable } from '@angular/core';
import { GestoreServerService } from '../server/gestore-server.service';
import { Metodi } from '../utils/TipiSpeciali';
import { AxiosError, AxiosResponse } from 'axios';

@Injectable({
  providedIn: 'root'
})
export class RegistrazioneService {

  constructor(private server : GestoreServerService) { }

  public async Registrazione(username : string, email : string) : Promise<AxiosResponse | AxiosError>{
    return this.server.InviaRichiesta(Metodi.POST, "/api/registrazione", { username, email }).catch(err => err);
  }
}
