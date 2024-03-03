import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ControllaToken } from '../utils/funzioni';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage implements OnInit{
  
  router : Router = new Router();

  async ngOnInit(): Promise<void> {
    try
    {
      await ControllaToken();
      console.log("Token valido");
    }
    catch(e) { this.router.navigate(["/login"]) }
  }
}
