import { Injectable } from '@angular/core';
import { Notifica } from '../../utils/TipiSpeciali';

@Injectable({
  providedIn: 'root'
})
export class NotificheService {
  public notifiche: Notifica[] = []
  public TEMPO_NOTIFICA: number = 5000;

  NuovaNotifica(n: Notifica){

    this.notifiche.push(n)

    setTimeout(() => {
        n.terminata = true
    }, this.TEMPO_NOTIFICA + 1);

    setTimeout(() => {
        if(this.notifiche.every(n => n.terminata))
        {
          this.notifiche = []
        } 
    }, (this.TEMPO_NOTIFICA + 1) * 2);
  }
}
