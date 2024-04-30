import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MapService } from 'src/app/admin/perizie/shared/map.service';
import {IonIcon} from "@ionic/angular/standalone";
import Opzione from 'src/app/comuni/elementi-form/dropdown/opzione.model';

@Component({
  selector: 'UtenteSelezionato',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss'],
  standalone: true,
  imports: [IonIcon]
})
export class SelectionComponent  implements OnInit {
  @Input() 
  selection!:Opzione;

  @Output() 
  selectionRemoved = new EventEmitter<Opzione>();
  
  constructor(public mapService:MapService) { }

  ngOnInit() {}
  removedSelection(selection:any){
    this.selectionRemoved.emit(selection);
    // this.mapService.creaMappa();
  }
}
