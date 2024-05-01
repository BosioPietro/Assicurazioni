import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GraficoLineaComponent } from './grafico-linea/grafico-linea.component';
import { GraficoBarreComponent } from './grafico-barre/grafico-barre.component';
import { CalendarioComponent } from './calendario/calendario.component';
import { AdminService } from '../admin.service';
import { HomeService } from './home.service';
import { NotificheService } from 'src/app/comuni/notifiche/notifiche.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, GraficoLineaComponent, 
            GraficoBarreComponent, CalendarioComponent]
})
export class HomePage implements OnInit{

  constructor(
    public admin: AdminService,
    public home: HomeService,
    public notifiche: NotificheService
  ) { }

  configGrafici?: Record<string, any>;

  async ngOnInit(){
    const aus = await this.home.ConfigurazioniGrafici();

    if(!aus){
      this.notifiche.NuovaNotifica({
        titolo: "Errore",
        descrizione : "Errore durante la richiesta dei dati",
        tipo: "errore"
      })
      return;
    }

    this.configGrafici = {
      perizie: aus.map((p) => p["perizie"].length),
      utenti: aus.map((p) => p["utenti"].length)
    }
  }

}
