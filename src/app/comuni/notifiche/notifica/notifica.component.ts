import { AfterViewChecked, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Notifica } from 'src/app/utils/TipiSpeciali';
import { IonIcon } from "@ionic/angular/standalone";
import { NotificheService } from '../notifiche.service';

@Component({
  selector: 'Notifica',
  templateUrl: './notifica.component.html',
  styleUrls: ['./notifica.component.scss'],
  imports: [IonIcon],
  standalone: true
})
export class NotificaComponent implements AfterViewChecked{

  @Input("info")
  info!: Notifica;

  @ViewChild("wrapper")
  wrapper!: ElementRef<HTMLElement>;

  constructor(private notifica: NotificheService){}

  ngAfterViewChecked(): void {
    setTimeout(() => {
      this.wrapper.nativeElement.classList.add("chiudi")
    }, this.notifica.TEMPO_NOTIFICA);
  }

  PrendiIcona(){
    if(this.info.icona) return this.info.icona;

    switch(this.info.tipo){
      case "info":
        return "information-circle";
      case "warning":
        return "warning";
      case "errore":
        return "close-circle";
    }
  }

  PrendiColore(){
    if(this.info.icona) return this.info.icona;

    switch(this.info.tipo){
      case "info":
        return "#4285f4";
      case "warning":
        return "#d1ca4b";
      case "errore":
        return "#de493e";
    }
  }

}
