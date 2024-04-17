import { Component, OnInit } from '@angular/core';
import {IonIcon} from "@ionic/angular/standalone";
import { RadioButtonComponent } from 'src/app/components/radio-button/radio-button.component';
import { SelectComponent } from 'src/app/components/select/select.component';
import { SelectionComponent } from 'src/app/components/selection/selection.component';
import { MapService } from '../shared/map.service';
import { UtilityService } from '../shared/utility.service';

@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.scss'],
  imports: [IonIcon, SelectComponent, RadioButtonComponent, SelectionComponent],
  standalone: true
})
export class FiltroComponent  implements OnInit {

  constructor(public mapService:MapService, public utilityService:UtilityService) { }
  elencoGenders:any [] = ["All","M", "F"];
  ngOnInit() {}
  onSelectionRemoved(selection:any){
    this.mapService.selectedOperators.splice(this.mapService.selectedOperators.indexOf(selection), 1);
    this.utilityService.elencoOperatori.push(selection);
  }
}
