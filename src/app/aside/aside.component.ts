import { Component, OnInit } from '@angular/core';
import { AsideComponentComponent } from './aside-component/aside-component.component';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss'],
  imports: [AsideComponentComponent],
  standalone: true
})
export class AsideComponent  implements OnInit {

  constructor() { }
  elencoVoci:any[] = ["Home","Mappa","Users","Documenti","Calendario","Chat","Sicurezza","Statistiche","Orari"]
  elencoIcons:any[] = ["home-outline","map-outline","people-outline","document-text-outline","calendar-outline","chatbox-ellipses-outline","key-outline","stats-chart-outline","time-outline"]
  elencoNotifications:any[] = [0,0,0,0,0,4,0,0,0]
  ngOnInit() {}

}
