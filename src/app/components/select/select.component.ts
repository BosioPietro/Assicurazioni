import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {IonIcon} from "@ionic/angular/standalone";
import { MapService } from 'src/app/home/shared/map.service';
import { UtilityService } from 'src/app/home/shared/utility.service';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  imports: [IonIcon, NgClass],
  standalone: true
})
export class SelectComponent  implements OnInit {

  constructor(public mapService:MapService, public utilityService:UtilityService) { }
  flagOpen: boolean = false;
  ngOnInit() {}

  openSelect(){
    this.flagOpen = !this.flagOpen;
  }
  optionCliccata(operatore:any){
    this.flagOpen = false;
    this.mapService.selectedOperators.push(operatore);
    this.utilityService.elencoOperatori.splice(this.utilityService.elencoOperatori.indexOf(operatore), 1);
    this.mapService.creaMappa();
  }
}
