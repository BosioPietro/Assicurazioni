import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, FormControl, ReactiveFormsModule, ValidatorFn, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

import RegexInput from 'src/app/utils/RegexInput';
import { Nullabile } from 'src/app/utils/TipiSpeciali';
import { RegistrazioneService } from '../registrazione.service';
import { AxiosError } from 'axios';

@Component({
  selector: 'app-registrazione',
  templateUrl: "./registrazione.page.html",
  styleUrls: ['./registrazione.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class RegistrazionePage{

  constructor(private registrazioneService : RegistrazioneService){}
  private router : Router = new Router();

  public form = new FormGroup({
    username: new FormControl('admin', [
      Validators.minLength(3),
      Validators.pattern(RegexInput["username"]),
      Validators.required
    ]),
    email: new FormControl('s@gmail.com', [
      Validators.pattern(RegexInput["email"]),
      Validators.required
    ])
  });
  public controlli = this.form.controls;

  // ngOnInit(): void {
  //   this.form.addValidators(this.ConfermaPassword);
  //   this.form.updateValueAndValidity();
  // }

  // ConfermaPassword(c: AbstractControl): Nullabile<ValidationErrors>{
  //   if(c.value["password"] !== c.value["confermaPassword"]){
  //     return { PasswordNoMatch: true };
  //   }
  //   else return null;
  // }

  async Registrazione(){
    const req = await this.registrazioneService.Registrazione(
      this.controlli["username"].value!, 
      this.controlli["email"].value!
    )

    if(req instanceof AxiosError){
      console.log(req)
      alert(`Errore: ${req.response!["data"]} (${req.response!.status})`);
      return;
    }

    alert("Utente creato con successo, Ora puoi effettuare il login");
    this.router.navigate(["/login"], { queryParams : { username : this.controlli["username"].value } });
  }
}
