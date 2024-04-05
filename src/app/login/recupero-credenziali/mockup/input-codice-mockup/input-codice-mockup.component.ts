import { Component, Input } from '@angular/core';
import { SincronizzazioneService } from '../../sincronizzazione.service';
import { FormsModule } from '@angular/forms';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'InputCodiceFinto',
  templateUrl: './input-codice-mockup.component.html',
  styleUrls: ['../../stile-input-codice.scss'],
  imports: [FormsModule, IonIcon],
  standalone: true
})
export class InputCodiceFintoComponent{
  @Input("messaggio-errore")
  errore?: string;

  constructor(public sinc: SincronizzazioneService){}
}
