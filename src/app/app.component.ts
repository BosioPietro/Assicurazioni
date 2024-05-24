import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SfondoComponent } from './comuni/sfondo/sfondo.component';
import { ContenitoreNotificheComponent } from './comuni/notifiche/contenitore-notifiche/contenitore-notifiche.component';
import { OnInit } from "@angular/core";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonApp, IonRouterOutlet, SfondoComponent, ContenitoreNotificheComponent],
})
export class AppComponent{
}
