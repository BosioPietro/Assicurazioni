import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TransizioneService } from '../../servizio-transizione.service';
import { SincronizzazioneService } from '../servizio.sincronizzazione';
import { InputCodiceFintoComponent } from './input-codice-mockup/input-codice-mockup.component';

@Component({
  selector: 'RecuperoCredenzialiFinto',
  templateUrl: './recupero-credenziali-mockup.component.html',
  styleUrls: ['./recupero-credenziali-mockup.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, InputCodiceFintoComponent, FormsModule]
})
export class RecuperoCredenzialiFinto implements AfterViewInit{

  constructor(public transizione: TransizioneService, public sinc: SincronizzazioneService){}

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
