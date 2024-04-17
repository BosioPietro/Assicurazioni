import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  flagRadioClicked:string = "All";
  elencoOperatori:any [] = ["Franco", "Giovanna", "Guglielmo", "Piero"];

  constructor() { }
}
