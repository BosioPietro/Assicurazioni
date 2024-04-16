import { Component, OnInit } from '@angular/core';
import {IonIcon} from "@ionic/angular/standalone";
import { SelectComponent } from 'src/app/components/select/select.component';

@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.scss'],
  imports: [IonIcon, SelectComponent],
  standalone: true
})
export class FiltroComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
