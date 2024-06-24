import { Injectable } from '@angular/core';
import { GestoreServerService } from 'src/app/server/gestore-server.service';
import { Metodi } from 'src/app/utils/TipiSpeciali';
import { SocialUser } from '@abacritt/angularx-social-login';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private server : GestoreServerService) { }

  public Login(username : string, password : string) {
    return this.server.InviaRichiesta(Metodi.POST, '/api/login', {username, password, web: true});
  }

  public LoginOAuth(user : SocialUser) {
    return this.server.InviaRichiesta(Metodi.POST, '/api/login-oauth', {...user, web: true});
  }
}
