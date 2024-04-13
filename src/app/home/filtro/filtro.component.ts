import { Component, OnInit } from '@angular/core';
import {IonIcon} from "@ionic/angular/standalone";

@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.scss'],
  imports: [IonIcon],
  standalone: true
})
export class FiltroComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
