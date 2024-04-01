import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TransizioneService } from '../../servizio-transizione.service';
import { SincronizzazioneService } from '../sincronizzazione.service';
import { InputCodiceFintoComponent } from './input-codice-mockup/input-codice-mockup.component';
import { Router } from '@angular/router';
import { InputTextComponent } from 'src/app/comuni/elementi-form/input-text/input-text.component';

@Component({
  selector: 'RecuperoCredenzialiFinto',
  templateUrl: './recupero-credenziali-mockup.component.html',
  styleUrls: ['./recupero-credenziali-mockup.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, InputCodiceFintoComponent, FormsModule, InputTextComponent]
})
export class RecuperoCredenzialiFinto implements AfterViewInit{

  constructor(public transizione: TransizioneService, public sinc: SincronizzazioneService, public router: Router){}

  @ViewChild("form")
  formHtml!: ElementRef<HTMLElement>;

  @ViewChild("formMail")
  formMail!: ElementRef<HTMLElement>;

  @ViewChild("formCodice")
  formCodice!: ElementRef<HTMLElement>;


  ngAfterViewInit(): void {
    this.transizione.AggiungiForm(this.formHtml.nativeElement, "/login/recupero-credenziali")

    this.sinc.formHtmlFinti["mail"] = this.formMail.nativeElement;
    this.sinc.formHtmlFinti["codice"] = this.formCodice.nativeElement;
  }
}
