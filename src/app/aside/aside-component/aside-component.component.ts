import { NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {IonIcon} from "@ionic/angular/standalone";

@Component({
  selector: 'app-aside-component',
  templateUrl: './aside-component.component.html',
  styleUrls: ['./aside-component.component.scss'],
  imports:[IonIcon, NgIf],
  standalone: true
})
export class AsideComponentComponent  implements OnInit {
  @Input() voce: any;
  @Input() icon:any;
  @Input() notification:any;
  constructor() { }
  
  ngOnInit() {}

}
