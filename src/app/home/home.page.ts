import { Component } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { DataStorageService } from '../shared/data-storage.service';
import { InfoWindowComponent } from './info-window/info-window.component';
import { MapService } from '../shared/map.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, GoogleMapsModule, InfoWindowComponent],
})
export class HomePage {
  constructor(private dataStorage: DataStorageService, private mapService:MapService) {}

  markerList:any[] = [];
  //map options
  center: google.maps.LatLngLiteral = { lat: 44.55577411467918, lng: 7.735974391878129 }
  zoom:number = 18
  directionService?: google.maps.DirectionsService;
  //marker
  ngOnInit(){
    this.dataStorage.inviaRichiesta("get", "/Perizie")?.subscribe((res)=>{
      console.log(res);
      this.markerList = res;
    })
  }
  onMarkerClick(event: google.maps.MapMouseEvent, marker: any){
    console.log(marker.coords)
    // this.mapService.markerCoords = JSON.stringify(marker.coords)
    this.mapService.markerCoordsObservable.next(marker);
  }

}