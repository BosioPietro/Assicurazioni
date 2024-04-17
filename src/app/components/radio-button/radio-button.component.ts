import { NgClass } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MapService } from 'src/app/home/shared/map.service';
import { UtilityService } from 'src/app/home/shared/utility.service';

@Component({
  selector: 'app-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss'],
  standalone: true,
  imports:[NgClass]
})
export class RadioButtonComponent  implements OnInit {
  @Input() label!: string;
  constructor(public utilityService:UtilityService, public mapService:MapService) { }

  ngOnInit() {}
  radioClicked(label:string){
    this.utilityService.flagRadioClicked = label;
    this.mapService.creaMappa();
  }
}
