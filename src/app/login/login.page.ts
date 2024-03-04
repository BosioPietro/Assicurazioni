import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginService } from './login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AxiosError } from 'axios';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class LoginPage implements OnInit {

  constructor(private servizio : LoginService) { }
    
  private router : Router = new Router();
  private activatedRoute = inject(ActivatedRoute);

  private username = this.activatedRoute.snapshot.queryParams["username"] || "";

  form : FormGroup = new FormGroup({
    username : new FormControl(this.username, [Validators.required]),
    password : new FormControl("", [Validators.required])
  });

  ngOnInit() {
  }

  async Login(){
    try
    {
      await this.servizio.Login(this.form.value["username"], this.form.value["password"]);
      this.router.navigate(["/home"]);
    }
    catch(e) {this.GestisciErrore(e as AxiosError)}
  }

  private GestisciErrore(err : AxiosError){
    switch(err.response?.status)
    {
      case 500: 
        return alert("Errore interno del server");
      case 400:
        return alert("Username non esistente")
      case 401:
        return alert("Password errata")
      default:
        return alert(`Errore: ${err.response?.data} (${err.response?.status})`);
    }
  }

}
