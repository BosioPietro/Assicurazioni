import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { InfoWindowComponent } from './info-window/info-window.component';
import { MapService } from './shared/map.service';
import { FiltroComponent } from './filtro/filtro.component';
import { GoogleMap, MapMarker, MapAdvancedMarker } from '@angular/google-maps';
import { NotificheService } from 'src/app/comuni/notifiche/notifiche.service';
import { ControllaToken } from 'src/app/utils/funzioni';
import { Router } from '@angular/router';

@Component({
  selector: 'PeriziePage',
  templateUrl: 'perizie.page.html',
  styleUrls: ['perizie.page.scss', '../../comuni/elementi-form/stile-mappa.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, GoogleMapsModule, 
            InfoWindowComponent, FiltroComponent, GoogleMap, MapMarker, 
            MapAdvancedMarker],
})
export class PeriziePage implements OnInit{
  constructor(
    public mapService:MapService, 
    private notifiche: NotificheService,
    private router: Router
  ) {}

  async ngOnInit(){
    ControllaToken(this.router);
    const aus = await this.mapService.PrendiPerizie();

    if(!aus){
      this.notifiche.NuovaNotifica({
        "titolo": "Errore",
        "descrizione": "Errore nel caricamento delle perizie",
        "tipo": "errore"
      })
      return;
    }
    await this.mapService.PrendiStili(aus);
    this.mapService.perizie = this.mapService.perizieFiltrate = aus;  
  }

  vallauri:string = "../assets/icon/vallauri.png"

  coordinateVallauri = {
    lat: 44.5558363,
    lng: 7.7169853
  }

  google = window.google;
  maps = this.google.maps;
}