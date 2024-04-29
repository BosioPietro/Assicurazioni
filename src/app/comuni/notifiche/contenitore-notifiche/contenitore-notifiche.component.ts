import { Component } from '@angular/core';
import { NotificaComponent } from '../notifica/notifica.component';
import { NotificheService } from '../notifiche.service';
import { animazione } from '../../animazioni/appari-disappari';

@Component({
  selector: 'ContenitoreNotifiche',
  templateUrl: './contenitore-notifiche.component.html',
  styleUrls: ['./contenitore-notifiche.component.scss'],
  imports: [NotificaComponent],
  animations: [animazione],
  standalone: true
})
export class ContenitoreNotificheComponent{

  constructor(public notifiche: NotificheService) { }

}
