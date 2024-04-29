import { Component, OnInit } from '@angular/core';
import { AsideComponentComponent } from './aside-component/voce-aside.component';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { animazione } from 'src/app/comuni/animazioni/appari-disappari';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'AsideComponent',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss'],
  imports: [AsideComponentComponent, MenuModule, IonIcon],
  animations: [animazione],
  standalone: true
})
export class AsideComponent  implements OnInit {

  constructor() { }
  elencoVoci:any[] = ["Home","Mappa","Users","Documenti","Calendario","Chat","Sicurezza","Statistiche","Orari"]
  elencoIcons:any[] = ["home","map","people","document-text","calendar","chatbox-ellipses","key","stats-chart","time"]
  elencoNotifications:any[] = [0,0,0,0,0,4,0,0,0]
  ngOnInit() {}

  opzioneLogout: MenuItem = {
    label: 'Logout',
    icon: 'pi pi-fw pi-sign-out',
    command: () => this.Logout()
  }

  Logout(){
    alert("sisi ok")
  }

}
