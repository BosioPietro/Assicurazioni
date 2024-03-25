import { Component, Input, OnInit } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { informationCircle } from 'ionicons/icons';

@Component({
  selector: 'Info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  standalone: true,
  imports: [IonIcon]
})
export class InfoComponent {

  @Input()
  messaggio! : string;

  constructor() { 
    addIcons({informationCircle})
  }

}
