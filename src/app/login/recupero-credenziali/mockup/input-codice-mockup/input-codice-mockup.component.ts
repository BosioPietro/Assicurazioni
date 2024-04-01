import { Component } from '@angular/core';
import { SincronizzazioneService } from '../../sincronizzazione.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'InputCodiceFinto',
  templateUrl: './input-codice-mockup.component.html',
  styleUrls: ['../../stile-input-codice.scss'],
  imports: [FormsModule],
  standalone: true
})
export class InputCodiceFintoComponent{
  constructor(public sinc: SincronizzazioneService){

  }
}
