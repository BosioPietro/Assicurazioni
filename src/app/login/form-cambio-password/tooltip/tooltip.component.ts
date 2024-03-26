import { Component } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { ellipseOutline, checkmarkCircle } from 'ionicons/icons';
import { CambioPasswordService } from '../cambio-password.service';


type Parametro = {
  regola : string,
  controllo : (s : string) => boolean
}

@Component({
  selector: 'Tooltip',
  templateUrl: './tooltip.component.html',
  standalone: true,
  imports: [IonIcon],
  styleUrls: ['./tooltip.component.scss'],
})
export class TooltipComponent {

  constructor(public servizio : CambioPasswordService){
    addIcons({checkmarkCircle, ellipseOutline })
    servizio.Controlla("");
  }
}
