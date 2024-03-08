import { Component } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, GoogleMapsModule],
})
export class HomePage {
  constructor() {
    this.marker = new google.maps.marker.AdvancedMarkerElement({position: this.center, map: this.map})
  }
  map: google.maps.Map;
  //map options
  center: google.maps.LatLngLiteral = { lat: 44.55577411467918, lng: 7.735974391878129 }
  zoom:number = 18
  //marker
  marker:google.maps.marker.AdvancedMarkerElement;
  path: google.maps.LatLngLiteral[] = [{lat: 44.55577411467918, lng: 7.735974391878129},{ lat:44.676290085000154, lng:7.56288085640056}]
  ngOnInit(){
    // this.marker = new google.maps.marker.AdvancedMarkerElement({position: this.center, map: this.map})
  }

}
