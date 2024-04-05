import { Component, Input } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeCircle } from 'ionicons/icons';

@Component({
  selector: 'Errore',
  templateUrl: './errore.component.html',
  styleUrls: ['./errore.component.scss'],
  standalone : true,
  imports : [IonIcon]
})
export class ErroreComponent {

  
  @Input()
  messaggio! : string;

  constructor() { 
    addIcons({closeCircle})
  }

}
