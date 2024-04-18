import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  flagRadioClicked:string = "All";
  flagRcClicked:string = "";
  elencoOperatori:any [] = ["Franco", "Giovanna", "Guglielmo", "Piero"];
  elencoMesi = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
  elencoNGiorni = [31,28,31,30,31,30,31,31,30,31,30,31];
  elencoGiorni:any [] = ["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"];
  elencoAnni = ["2023","2022","2021","2020","2019"];
  constructor() { }
}
