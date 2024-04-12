import { Injectable } from '@angular/core';
import { Notifica } from '../../utils/TipiSpeciali';

@Injectable({
  providedIn: 'root'
})
export class NotificheService {
  public notifiche: Notifica[] = []
  public TEMPO_NOTIFICA: number = 5000;

  RimuoviNotifica(){
    this.notifiche.pop()
    console.log(this.notifiche)
  }

  NuovaNotifica(n: Notifica){
    this.notifiche.push(n)
    setTimeout(() => {
        // this.RimuoviNotifica()
    }, this.TEMPO_NOTIFICA + 1);
  }

  
}
