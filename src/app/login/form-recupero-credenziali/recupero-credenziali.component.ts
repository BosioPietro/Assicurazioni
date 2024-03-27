import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransizioneService } from '../servizio-transizione.service';

@Component({
  selector: 'app-recupero-credenziali',
  templateUrl: './recupero-credenziali.component.html',
  standalone: true,
  styleUrls: ['./recupero-credenziali.component.scss'],
  imports: [ReactiveFormsModule]
})
export class RecuperoCredenzialiComponent implements AfterViewInit{

  constructor(private transizione : TransizioneService){}

  ngAfterViewInit(): void {
    this.transizione.AperturaFormCambio(this.formHtml.nativeElement);
    this.transizione.SpostamentoLogo(this.logoHtml.nativeElement);
  }

  form : FormGroup = new FormGroup({
    "mail-recupero" : new FormControl("", [Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)])
  })

  @ViewChild("formCambio")
  formHtml! : ElementRef<HTMLElement>;

  @ViewChild("logo")
  logoHtml! : ElementRef<HTMLElement>;
}
