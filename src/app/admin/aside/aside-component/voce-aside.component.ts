import { NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {IonIcon} from "@ionic/angular/standalone";

@Component({
  selector: 'VoceAside',
  templateUrl: './voce-aside.component.html',
  styleUrls: ['./voce-aside.component.scss'],
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
