import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, FormControl, ReactiveFormsModule, ValidatorFn, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

import RegexInput from 'src/app/utils/RegexInput';
import { Nullabile } from 'src/app/utils/TipiSpeciali';
import { RegistrazioneService } from '../registrazione.service';

@Component({
  selector: 'app-registrazione',
  templateUrl: './registrazione.page.html',
  styleUrls: ['./registrazione.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class RegistrazionePage implements OnInit{

  constructor(private registrazioneService : RegistrazioneService){}
  private router : Router = new Router();

  public form = new FormGroup({
    username: new FormControl('', [
      Validators.minLength(3),
      Validators.pattern(RegexInput["username"]),
      Validators.required
    ]),
    email: new FormControl('', [
      Validators.pattern(RegexInput["email"]),
      Validators.required
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(RegexInput["password"]),
    ]),
    confermaPassword: new FormControl('', [
      Validators.required,
    ])
  });
  public controlli = this.form.controls;

  ngOnInit(): void {
    this.form.addValidators(this.ConfermaPassword);
    this.form.updateValueAndValidity();
  }

  ConfermaPassword(c: AbstractControl): Nullabile<ValidationErrors>{
    if(c.value["password"] !== c.value["confermaPassword"]){
      return { PasswordNoMatch: true };
    }
    else return null;
  }

  async Registrazione(){
    try
    {
      const data = await this.registrazioneService.Registrazione(
        this.controlli["username"].value!,
        this.controlli["email"].value!,
        this.controlli["email"].value!
      )
    }
    catch(err)
    {
      console.log(err);
    }
  }
}
