import { Component, OnInit } from '@angular/core';
import { HomeService } from '../home.service';
import Utente from '../../utenti/tabella-utenti/utente.model';
import { NotificheService } from 'src/app/comuni/notifiche/notifiche.service';
import { ImmagineProfiloDefault } from 'src/app/comuni/immagine-profilo-default/immagine-profilo-default.component';

@Component({
  selector: 'Utenti',
  templateUrl: './utenti.component.html',
  styleUrls: ['./utenti.component.scss'],
  imports: [ImmagineProfiloDefault],
  standalone: true
})
export class UtentiComponent  implements OnInit {

  constructor(public home: HomeService, private notifiche: NotificheService) { }

  utenti?: Utente[]

  async ngOnInit() {
    this.utenti = await this.home.PrendiUtenti();

    if(!this.utenti){
      this.notifiche.NuovaNotifica({
        titolo: "Errore",
        descrizione : "Errore durante la richiesta dei dati",
        tipo: "errore"
      })
    }
  }
}
