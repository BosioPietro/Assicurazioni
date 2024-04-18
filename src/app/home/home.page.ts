import { Component, ViewChild } from '@angular/core';
import { GoogleMapsModule, MapAdvancedMarker } from '@angular/google-maps';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { InfoWindowComponent } from './info-window/info-window.component';
import { MapService } from './shared/map.service';
import { NgClass } from '@angular/common';
import { AsideComponent } from '../aside/aside.component';
import { FiltroComponent } from './filtro/filtro.component';

// declare var google:any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, GoogleMapsModule, InfoWindowComponent, NgClass, AsideComponent, FiltroComponent],
})
export class HomePage {
  @ViewChild('mapElement') mapElement: any;
  constructor(public mapService:MapService) {}
  vallauri:string = "../assets/icon/vallauri.png"

  directionService?: google.maps.DirectionsService;
  //marker
  ngAfterViewInit(){
      this.mapService.mapRecipient = this.mapElement.nativeElement;
      this.mapService.map = new google.maps.Map(this.mapElement.nativeElement, this.mapService.mapOptions);
      this.mapService.creaMappa();
  }
  ngOnInit(){
    
    
  }
//   onMarkerClick(event: google.maps.MapMouseEvent, marker: any){
//     this.mapService.markerCoordsObservable.next(marker);
//     this.mapService.flagInfoWindow = true;

//   }


}