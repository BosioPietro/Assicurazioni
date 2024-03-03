import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginService } from './login.service';
import { Router } from '@angular/router';

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

  form : FormGroup = new FormGroup({
    username : new FormControl("", [Validators.required]),
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
    catch(e)
    {
      this.GestisciErrore(e);
    }
  }

  private GestisciErrore(err : any){
    console.log(err);
  }

}
