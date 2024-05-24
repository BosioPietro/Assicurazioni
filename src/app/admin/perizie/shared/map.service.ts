import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UtilityService } from './utility.service';
import { GestoreServerService } from 'src/app/server/gestore-server.service';
import { Perizia } from '../../perizia/perizia.model';
import { Metodi } from 'src/app/utils/TipiSpeciali';
import Utente from '../../utenti/tabella-utenti/utente.model';
import Opzione from 'src/app/comuni/elementi-form/dropdown/opzione.model';
import { StringaInData } from 'src/app/utils/funzioni';
@Injectable({
  providedIn: 'root'
})
export class MapService {
  constructor(
    public utilityService:UtilityService,
    public server: GestoreServerService
  ) { }


  
  center: google.maps.LatLngLiteral = { lat: 44.55577411467918, lng: 7.735974391878129 }
  perizie:Perizia[] = [];
  perizieFiltrate:Perizia[] = [];
  stiliMarker: Record<string, any>[] = []
  utentiFiltrati: Opzione[] = [{valore: "tutti", testo: "Tutti"}];
  utenti:Utente[] = [];

  pickedDates:Date[] = [];
  flagInfoWindow:boolean = false;
  markers: google.maps.Marker[] = [];
  markerCoords:any;
  newMarker:any;
  map?:google.maps.Map;
  mapRecipient:any;
  zoom:number = 13

  google = window.google;
  maps = this.google.maps;

  FiltraPerizie(){
    this.perizieFiltrate = structuredClone(this.perizie);
    
    // GENERE
    const genere = this.utilityService.flagRadioClicked.charAt(0);

    this.perizieFiltrate = this.perizieFiltrate.filter((p) =>{
      let utentiFiltrati = this.utenti.filter((u) => this.utentiFiltrati.map((u) => u.valore).includes(u.username));
      utentiFiltrati = utentiFiltrati.filter((u) => u.genere == genere || genere == "T");

      return utentiFiltrati.map((u) => u.username).includes(p.codOperatore);
    })

    // UTENTI
    this.perizieFiltrate = this.perizieFiltrate.filter((p) => this.utentiFiltrati.map((u) => u.valore).includes(p.codOperatore));

    // DATE
    this.perizieFiltrate = this.perizieFiltrate.filter((p) =>{
      if(this.pickedDates.length == 2 && this.pickedDates[1] == undefined){
        // return (new Date(marker.data.date) >= new Date(this.pickedDates[0]));
        return true;
      }else if(this.pickedDates.length == 2 && this.pickedDates[1] != undefined){
        return (StringaInData(p.data) >= new Date(this.pickedDates[0]) && StringaInData(p.data) <= new Date(this.pickedDates[1]));
      }else if(this.pickedDates.length == 1){
        return (StringaInData(p.data) >= new Date(this.pickedDates[0]));
      }
      else return true;
    })

    console.log(this.perizieFiltrate.length, this.stiliMarker.length)
  }

  async PrendiStili(aus: Perizia[]){
    const { PinElement } = await this.maps.importLibrary("marker") as google.maps.MarkerLibrary;
    
    const locale = aus || this.perizie;

    this.stiliMarker = locale.map((p: Perizia) => {
      return {
        codice: +p["codice"],
        pin: new PinElement({
          "background": "#245c73",
          "borderColor": "#f2f3f5",
          "glyphColor": "#f2f3f5",
          "scale": 1.2,
        })
      }
    })
  }

  StileMarker(p: Perizia){
    return this.stiliMarker.find((s) => +s["codice"] == +p.codice)!["pin"]["element"]
  }
  

  PrendiPerizie(){
    return new Promise<Perizia[] | null>((resolve) => {
      this.server.InviaRichiesta(Metodi.GET, "/api/perizie")
      .then((res: Record<string, any>) => resolve(res["data"]))
      .catch(() => resolve(null))
    })
  }
  
  PrendiUtenti(){
    return new Promise<Utente [] | null>((resolve) => {
      this.server.InviaRichiesta(Metodi.GET, "/api/utenti")
      .then((res: Record<string, any>) => resolve(res["data"]))
      .catch(() => resolve(null))
    });
  }

  CaricaPerizia(p: Perizia){
    return new Promise<boolean>((resolve) => {
      this.server.InviaRichiesta(Metodi.POST, `/api/nuova-perizia`, Object.assign(p, { elaborata: StringaInData(p["data"]).getTime() < new Date().getTime()}))
      .then((res: Record<string, any>) => {
        resolve(true)
      })
      .catch(() => resolve(false))
    })
  }
}
