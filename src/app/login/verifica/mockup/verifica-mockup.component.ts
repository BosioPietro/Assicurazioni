import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { InputCodiceComponent } from 'src/app/comuni/elementi-form/input-codice/input-codice.component';
import { SincronizzazioneService } from '../sincronizzazione.service';
import { TransizioneService } from '../../servizio-transizione.service';

@Component({
  selector: 'VerificaFinto',
  templateUrl: './verifica-mockup.component.html',
  styleUrls: ['../../stile-form.scss', '../stile-form.scss'],
  imports: [InputCodiceComponent],
  standalone: true
})
export class VerificaFintoComponent implements AfterViewInit {

  @ViewChild("form")
  formHtml!:ElementRef<HTMLElement>;

  constructor(public sinc: SincronizzazioneService, private transizione: TransizioneService) { }

  ngAfterViewInit(): void {
    this.transizione.AggiungiForm(this.formHtml.nativeElement, "/login/verifica");
  }

}
