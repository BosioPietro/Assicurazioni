import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TransizioneService } from '../../servizio-transizione.service';
import { SincronizzazioneService } from '../sincronizzazione.service';
import { InputCodiceComponent } from 'src/app/comuni/elementi-form/input-codice/input-codice.component';
import { Router } from '@angular/router';
import { InputTextComponent } from 'src/app/comuni/elementi-form/input-text/input-text.component';
import { RimuoviParametri } from 'src/app/utils/funzioni';

@Component({
  selector: 'RecuperoCredenzialiFinto',
  templateUrl: './recupero-credenziali-mockup.component.html',
  styleUrls: ['../../stile-form.scss', '../stile-form.scss', './recupero-credenziali-mockup.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, InputTextComponent, InputCodiceComponent]
})
export class RecuperoCredenzialiFinto implements AfterViewInit{

  constructor(public transizione: TransizioneService, public sinc: SincronizzazioneService, public router: Router){}

  @ViewChild("form")
  formHtml!: ElementRef<HTMLElement>;

  @ViewChild("formMail")
  formMail!: ElementRef<HTMLElement>;

  @ViewChild("formCodice")
  formCodice!: ElementRef<HTMLElement>;

  public RimuoviParametri = RimuoviParametri;

  ngAfterViewInit(): void {
    this.transizione.AggiungiForm(this.formHtml.nativeElement, "/login/recupero-credenziali")

    this.sinc.formHtmlFinti["mail"] = this.formMail.nativeElement;
    this.sinc.formHtmlFinti["codice"] = this.formCodice.nativeElement;
  }
}
