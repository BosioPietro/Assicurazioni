import { Component, Output, EventEmitter } from '@angular/core';
import { NotificheService } from 'src/app/comuni/notifiche/notifiche.service';
import { Notifica } from 'src/app/utils/TipiSpeciali';

@Component({
  selector: 'LoginMicrosoft',
  templateUrl: './login-microsoft.component.html',
  styleUrls: ['./login-microsoft.component.scss'],
  standalone: true,
})
export class LoginMicrosoftComponent {

  @Output() 
  loginWithMicrosoft: EventEmitter<any> = new EventEmitter<any>();

  constructor(private notifiche: NotificheService){}

  Login() {
    this.notifiche.NuovaNotifica({
      "titolo" : "Dati inseriti non validi",
      "tipo" : "info"
    } as Notifica)
  }
}
