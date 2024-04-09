import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { informationCircle } from 'ionicons/icons';

@Component({
  selector: 'Info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon]
})
export class InfoComponent {

  @Input()
  messaggio! : string;

  @Input()
  icona: string =  "information-circle";

  @Input()
  inattivo: boolean = false;

  constructor() { 
    addIcons({informationCircle})
  }

}
