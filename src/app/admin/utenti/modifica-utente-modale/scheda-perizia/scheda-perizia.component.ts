import { Component, Input } from '@angular/core';
import { Perizia } from 'src/app/admin/perizia/perizia.model';

@Component({
  selector: 'app-scheda-perizia',
  templateUrl: './scheda-perizia.component.html',
  styleUrls: ['./scheda-perizia.component.scss'],
})
export class SchedaPeriziaComponent{

  @Input()
  perizia!: Perizia;

}
