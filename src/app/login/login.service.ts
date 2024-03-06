import { Injectable } from '@angular/core';
import { GestoreServerService } from '../server/gestore-server.service';
import { Metodi } from '../utils/TipiSpeciali';
import { SocialUser } from '@abacritt/angularx-social-login';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private server : GestoreServerService) { }

  public Login(username : string, password : string) {
    return this.server.InviaRichiesta(Metodi.POST, '/api/login', {username, password});
  }

  public LoginGoogle(user : SocialUser) {
    return this.server.InviaRichiesta(Metodi.POST, '/api/login-google', user);
  }
}
