import { Component, Input } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'PopOver',
  templateUrl: './pop-over.component.html',
  styleUrls: ['./pop-over.component.scss'],
  imports: [IonIcon],
  standalone: true
})
export class PopOverComponent {

  @Input()
  icona: string = "information-circle"

  @Input()
  colore: string = "var(--accento)"

  @Input()
  messaggio!: string;

  @Input()
  mockup: boolean = false;

  visibile: boolean = false;

}
