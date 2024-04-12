import { Component } from '@angular/core';
import { NotificaComponent } from '../notifica/notifica.component';
import { NotificheService } from '../notifiche.service';

@Component({
  selector: 'ContenitoreModifica',
  templateUrl: './contenitore-notifiche.component.html',
  styleUrls: ['./contenitore-notifiche.component.scss'],
  imports: [NotificaComponent],
  standalone: true
})
export class ContenitoreNotificheComponent {

  constructor(public notifiche: NotificheService) { }

}
