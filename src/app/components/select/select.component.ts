import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Input() options:any;
  @Input() label:any;
  @Output() optionClicked = new EventEmitter<any>();
  
  title:any;
  constructor(public mapService:MapService, public utilityService:UtilityService) { }
  flagOpen: boolean = false;
  ngOnInit() {
    this.title = this.label;
  }

  openSelect(){
    this.flagOpen = !this.flagOpen;
  }
  optionCliccata(option:any){
    this.flagOpen = false;
    this.title = option;
    this.optionClicked.emit(option);
  }
}
