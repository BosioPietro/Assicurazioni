import { NgClass, NgIf, NgStyle } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MapService } from 'src/app/home/shared/map.service';
import { UtilityService } from 'src/app/home/shared/utility.service';
import { IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: 'app-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss'],
  standalone: true,
  imports:[NgClass,NgIf,IonIcon,NgStyle]
})
export class RadioButtonComponent  implements OnInit {
  @Input() label!: string;
  @Input() flag: boolean = false;
  @Input() width: string = "";
  constructor(public utilityService:UtilityService, public mapService:MapService) { }

  ngOnInit() {}
  radioClicked(label:string){
    console.log("fatto1");
    this.utilityService.flagRadioClicked = label;
    this.mapService.creaMappa();
  }
  rc(label:string){
    console.log("fatto2");
    this.utilityService.flagRcClicked = label;
  }
}
