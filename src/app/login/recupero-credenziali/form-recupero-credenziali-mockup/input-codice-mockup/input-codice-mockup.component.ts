import { Component } from '@angular/core';
import { SincronizzazioneService } from '../../servizio.sincronizzazione';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'InputCodiceFinto',
  templateUrl: './input-codice-mockup.component.html',
  styleUrls: ['./input-codice-mockup.component.scss'],
  imports: [FormsModule],
  standalone: true
})
export class InputCodiceFintoComponent{
  constructor(public sinc: SincronizzazioneService){

  }
}
