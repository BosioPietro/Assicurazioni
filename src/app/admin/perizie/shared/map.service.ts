import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UtilityService } from './utility.service';
import { GestoreServerService } from 'src/app/server/gestore-server.service';
import { Perizia } from '../../perizia/perizia.model';
import { Metodi } from 'src/app/utils/TipiSpeciali';
import Utente from '../../utenti/tabella-utenti/utente.model';
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
  utenteFiltrato: string = "tutti";

  pickedDates:Date[] = [];
  flagInfoWindow:boolean = false;
  selectedOperators:any []= [];
  markers: google.maps.Marker[] = [];
  markerCoords:any;
  newMarker:any;
  map?:google.maps.Map;
  mapRecipient:any;
  zoom:number = 13

  google = window.google;
  maps = this.google.maps;

  filterMarkers(){
    // this.filteredMarkers = this.markerList;
    // this.filteredMarkers = this.markerList.filter(marker =>{
    //   return ((marker.utente.genere == this.utilityService.flagRadioClicked && this.utilityService.flagRadioClicked != "All") || this.utilityService.flagRadioClicked == "All");
    // })
    // this.filteredMarkers = this.filteredMarkers.filter(marker =>{
    //   return ((this.selectedOperators.includes(marker.utente.nome) && this.selectedOperators.length != 0) || this.selectedOperators.length == 0);
    // })
    // this.filteredMarkers = this.filteredMarkers.filter(marker=>{
    //   if(this.pickedDates.length == 2 && this.pickedDates[1] == undefined){
    //     // return (new Date(marker.data.date) >= new Date(this.pickedDates[0]));
    //     return true;
    //   }else if(this.pickedDates.length == 2 && this.pickedDates[1] != undefined){
    //     return (new Date(marker.data.date) >= new Date(this.pickedDates[0]) && new Date(marker.data.date) <= new Date(this.pickedDates[1]));
    //   }else if(this.pickedDates.length == 1){
    //     return (new Date(marker.data.date) >= new Date(this.pickedDates[0]));
    //   }
    //   else return true;
    // })
  }

  async PrendiStili(aus: Perizia[]){
    const { PinElement } = await this.maps.importLibrary("marker") as google.maps.MarkerLibrary;
    
    const locale = aus || this.perizie;

    this.stiliMarker = locale.map((p: Perizia) => {
      return {
        codice: p["codice"],
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
    return this.stiliMarker.find((s) => s["codice"] == p.codice)!["pin"]["element"]
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
}
