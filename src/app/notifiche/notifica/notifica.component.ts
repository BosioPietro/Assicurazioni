import { Component, Input } from '@angular/core';
import { Notifica } from 'src/app/utils/TipiSpeciali';
import { IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: 'Notifica',
  templateUrl: './notifica.component.html',
  styleUrls: ['./notifica.component.scss'],
  imports: [IonIcon],
  standalone: true
})
export class NotificaComponent {

  @Input("info")
  info!: Notifica;

  PrendiIcona(){
    if(this.info.icona) return this.info.icona;

    switch(this.info.tipo){
      case "info":
        return "information-circle-outline";
      case "warning":
        return "warning-outline";
      case "errore":
        return "close-circle-outline";
    }
  }

}
