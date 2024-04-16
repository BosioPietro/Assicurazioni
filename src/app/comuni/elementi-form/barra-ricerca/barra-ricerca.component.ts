import { Component, EventEmitter, Output } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'BarraRicerca',
  templateUrl: './barra-ricerca.component.html',
  styleUrls: ['./barra-ricerca.component.scss'],
  imports: [IonIcon],
  standalone: true,
})
export class BarraRicercaComponent{
  @Output()
  onCerca = new EventEmitter<string>();
  
  Cerca(e: Event){
    const input = e.target as HTMLInputElement;
    this.onCerca.emit(input.value);
  }
}
