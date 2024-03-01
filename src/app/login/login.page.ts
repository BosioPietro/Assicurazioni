import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginService } from './login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {

  constructor(private servizio : LoginService) { }

  private router : Router = new Router();

  public isValid = false;
  public username = "";
  public password = "";

  ngOnInit() {
  }

  async Login(){
    const data = await this.servizio.Login(this.username, this.password).catch(this.GestisciErrore);
    console.log(data)
    if(data && "ok" in data)
    {
      this.router.navigate(["/home"]);
    }
  }

  private GestisciErrore(err : any){
    console.log(err);
  }

}
