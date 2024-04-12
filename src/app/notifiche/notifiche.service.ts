import { Injectable } from '@angular/core';
import { Notifica } from '../utils/TipiSpeciali';

@Injectable({
  providedIn: 'root'
})
export class NotificheService {
  public notifiche: Notifica[] = []

  RimuoviNotifica(){
    this.notifiche.pop();
  }
  
}
