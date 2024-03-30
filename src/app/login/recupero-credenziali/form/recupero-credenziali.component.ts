import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TransizioneService } from '../../servizio-transizione.service';
import { Router } from '@angular/router';
import { InputCodiceComponent } from './input-codice/input-codice.component';
import { SincronizzazioneService } from '../servizio.sincronizzazione';

@Component({
  selector: 'form-recupero-credenziali',
  templateUrl: './recupero-credenziali.component.html',
  standalone: true,
  styleUrls: ['./recupero-credenziali.component.scss'],
  imports: [ReactiveFormsModule, InputCodiceComponent, FormsModule],
})
export class RecuperoCredenzialiComponent implements AfterViewInit{
  
  constructor(public transizione : TransizioneService, public sinc: SincronizzazioneService, public router : Router){}

  @ViewChild("formHtml")
  formHtml!: ElementRef<HTMLElement>

  ngAfterViewInit(): void {
    this.transizione.formVeri["/login/recupero-credenziali"] = this.formHtml.nativeElement;
  }

  NavigaLogin(){
    this.transizione.TransizioneUscita(this.formHtml.nativeElement, "/login");
      setTimeout(() => {
        this.router.navigateByUrl("/login");
      }, 500);
  }

  InviaMail(){
    this.sinc.TransizioneForm(this.formHtml.nativeElement);
  }

  ControllaCodice(corretto: boolean){
    this.sinc.codiceCorretto = corretto;
  }

  ResetPassword(){
    this.transizione.TransizioneUscita(this.formHtml.nativeElement, "/login/reset-password");
    setTimeout(() => {
      this.router.navigateByUrl("/login/reset-password");
    }, 500);
  }
}
