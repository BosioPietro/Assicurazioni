import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MapService } from 'src/app/admin/perizie/shared/map.service';
import {IonIcon} from "@ionic/angular/standalone";

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss'],
  standalone: true,
  imports: [IonIcon]
})
export class SelectionComponent  implements OnInit {
  @Input() selection:any;
  @Output() selectionRemoved = new EventEmitter<any>();
  constructor(public mapService:MapService) { }

  ngOnInit() {}
  removedSelection(selection:any){
    this.selectionRemoved.emit(selection);
    // this.mapService.creaMappa();
  }
}
