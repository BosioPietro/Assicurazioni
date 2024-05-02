import { Component, OnInit } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { MapService } from './shared/map.service';
import { FiltroComponent } from './filtro/filtro.component';
import { GoogleMap, MapMarker, MapAdvancedMarker } from '@angular/google-maps';
import { NotificheService } from 'src/app/comuni/notifiche/notifiche.service';
import { ControllaToken } from 'src/app/utils/funzioni';
import { Router } from '@angular/router';
import { ModaleSiNoComponent } from 'src/app/comuni/modale-si-no/modale-si-no.component';
import { Perizia } from '../perizia/perizia.model';
import { IonIcon } from '@ionic/angular/standalone';
import { CreaPeriziaComponent } from './crea-perizia-modale/crea-perizia-modale.component';

@Component({
  selector: 'PeriziePage',
  templateUrl: 'perizie.page.html',
  styleUrls: ['perizie.page.scss', '../../comuni/elementi-form/stile-mappa.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, GoogleMapsModule, 
            FiltroComponent, GoogleMap, MapMarker, MapAdvancedMarker,
            ModaleSiNoComponent, IonIcon, CreaPeriziaComponent],
})
export class PeriziePage implements OnInit{
  constructor(
    public mapService: MapService, 
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

  periziaSelezionata?: Perizia;

  ApriPerizia(p: Perizia){
    this.periziaSelezionata = p;
  }

  ChiudiElimina(dialogo: ModaleSiNoComponent){
    const modale = dialogo.modale.nativeElement;

    modale.classList.add("chiudi");
    setTimeout(() => {
      modale.close()
      modale.classList.remove("chiudi");
      this.periziaSelezionata = undefined;
    }, 301);
  }

  NuovaPaginaPerizia(d: ModaleSiNoComponent){
    window.open(`/admin/perizie/${this.periziaSelezionata!.codice}`, "_blank");
    this.ChiudiElimina(d)
  }

  vuoleCrearePerizia: boolean = false;

  caricamentoAggiungi: boolean = false;
  async AggiungiPerizia(p: Perizia){
    this.caricamentoAggiungi = true;
    const caricamento = await this.mapService.CaricaPerizia(p);
    this.caricamentoAggiungi = false;
    this.mapService.perizie.push(p);
    await this.mapService.PrendiStili(this.mapService.perizie);

    this.mapService.FiltraPerizie();
    console.clear()


    if(!caricamento){
      this.notifiche.NuovaNotifica({
        titolo: "Errore",
        descrizione: "Errore nel caricamento della perizia",
        tipo: "errore"
      });
    }
    else{
      this.notifiche.NuovaNotifica({
        titolo: "Operazione completata",
        descrizione: "Perizia caricata con successo",
        tipo: "info"
      });
      this.vuoleCrearePerizia = false;
    }
  }

}