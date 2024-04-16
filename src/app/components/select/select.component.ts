import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {IonIcon} from "@ionic/angular/standalone";

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  imports: [IonIcon, NgClass],
  standalone: true
})
export class SelectComponent  implements OnInit {

  constructor() { }
  elencoOperatori:any [] = ["Franco", "Giovanni", "Guglielmo", "Piero"];
  flagOpen: boolean = false;
  ngOnInit() {}

  openSelect(){
    this.flagOpen = !this.flagOpen;
  }
  optionCliccata(operatore:any){
    this.flagOpen = false;
  }
}
