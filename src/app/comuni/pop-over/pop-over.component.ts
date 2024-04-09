import { Component, Input } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { animazione } from '../animazioni/appari-disappari';

@Component({
  selector: 'PopOver',
  templateUrl: './pop-over.component.html',
  styleUrls: ['./pop-over.component.scss'],
  imports: [IonIcon],
  animations: [animazione],
  standalone: true
})
export class PopOverComponent {

  @Input()
  icona: string = "information-circle"

  @Input()
  colore: string = "var(--accento)"

  @Input()
  messaggio!: string;

  visibile: boolean = false;

}
