import { Injectable } from '@angular/core';
import { GestoreServerService } from '../server/gestore-server.service';
import { Metodi } from '../utils/TipiSpeciali';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private server : GestoreServerService) { }

  public Login(username : string, password : string) {
    return this.server.InviaRichiesta(Metodi.POST, '/api/login', {username, password});
  }
}
