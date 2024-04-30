import { Component, Input, OnInit } from '@angular/core';
import { MapService } from 'src/app/admin/perizie/shared/map.service';
import { UtilityService } from 'src/app/admin/perizie/shared/utility.service';
import { IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: 'RadioButton',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss'],
  standalone: true,
  imports:[IonIcon]
})
export class RadioButtonComponent {
  @Input() 
  label!: string;

  constructor(public utilityService:UtilityService, public mapService:MapService) { }

  radioClicked(label:string){
    this.utilityService.flagRadioClicked = label;
    this.mapService.FiltraPerizie();
  }
}
