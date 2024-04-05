import { Component, Input } from '@angular/core';

@Component({
  selector: 'FintoHr',
  templateUrl: './finto-hr.component.html',
  styleUrls: ['./finto-hr.component.scss'],
  standalone: true
})
export class FintoHrComponent{

  @Input()
  testo! : string;

}
