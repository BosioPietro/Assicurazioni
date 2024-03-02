import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, FormControl, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import RegexInput from 'src/app/utils/RegexInput';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrati',
  templateUrl: './registrati.page.html',
  styleUrls: ['./registrati.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class RegistratiPage implements OnInit {

  private router : Router = new Router();

  public form = new FormGroup({
    nome: new FormControl('', [
      Validators.minLength(3),
      Validators.pattern(RegexInput["nome"]),
      Validators.required
    ]),
    cognome: new FormControl('', [
      Validators.minLength(3),
      Validators.required,
      Validators.pattern(RegexInput["cognome"])
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
      this.ConfermaPassword()
    ]),
  });
  public controlli = this.form.controls;

  ngOnInit() {
  }

  public Registrazione() {
    if(this.form.valid){
      this.router.navigate(["/home"]);
    }
  }

  private InputValido(input : FormControl, nome : string) : ValidatorFn{
    if(!input.value){
      input.setErrors({required: true});
      return () => ({ required: true });
    }
    else if(!input.value.match(RegexInput[nome])){
      input.setErrors({pattern: true});
      return () => ({ pattern: true });
    }
    return () => null;
  }

  private ConfermaPassword() : ValidatorFn{
    if(this.controlli["password"].value != this.controlli.confermaPassword.value){
      return () => ({ passwordMismatch: true });
    }
    return () => null;
  }

}
