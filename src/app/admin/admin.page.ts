import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AsideComponent } from './aside/aside.component';
import Utente from './utenti/tabella-utenti/utente.model';
import { Metodi } from '../utils/TipiSpeciali';
import { GestoreServerService } from '../server/gestore-server.service';
import { NotificheService } from '../comuni/notifiche/notifiche.service';
import { AdminService } from './admin.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, AsideComponent]
})
export class AdminPage implements OnInit {

  constructor(
    private admin: AdminService,
    private notifiche: NotificheService,
  ) { }


  async ngOnInit() {
    this.admin.utente = await this.admin.PrendiInfoUtente()
  
    if(!this.admin.utente){
      this.notifiche.NuovaNotifica({
        titolo: "Errore",
        descrizione: "Errore nel caricamento delle informazioni utente",
        tipo: "errore"
      })
    }
  }

}
