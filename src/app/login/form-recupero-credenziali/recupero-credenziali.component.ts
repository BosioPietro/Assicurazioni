import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransizioneService } from '../servizio-transizione.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recupero-credenziali',
  templateUrl: './recupero-credenziali.component.html',
  standalone: true,
  styleUrls: ['./recupero-credenziali.component.scss'],
  imports: [ReactiveFormsModule]
})
export class RecuperoCredenzialiComponent implements AfterViewInit{
  @ViewChild("formCambio")
  formHtml! : ElementRef<HTMLElement>;

  @ViewChild("logo")
  logoHtml! : ElementRef<HTMLElement>;
  
  router : Router = new Router();
  
  constructor(private transizione : TransizioneService){}

  ngAfterViewInit(): void {
    this.transizione.AperturaForm(this.formHtml.nativeElement);
    this.transizione.SpostamentoLogo(this.logoHtml.nativeElement);
  }

  form : FormGroup = new FormGroup({
    "mail-recupero" : new FormControl("", [Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)])
  })

  NavigaLogin(){
    this.transizione.PosizioneLogo(this.logoHtml.nativeElement, this.router.url)
    this.transizione.CalcolaWidth(this.formHtml.nativeElement, this.router.url)
    this.transizione.MostraProssimoWrapper("/login");
    this.transizione.NascondiWrapperTransizione(this.formHtml.nativeElement, this.router.url)
    this.router.navigateByUrl("/login")
  }
}
