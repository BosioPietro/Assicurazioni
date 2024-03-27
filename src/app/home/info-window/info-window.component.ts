import { Component, OnInit } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { MapService } from 'src/app/shared/map.service';

@Component({
  selector: 'app-info-window',
  templateUrl: './info-window.component.html',
  styleUrls: ['./info-window.component.scss'],
  standalone: true,
  imports: [GoogleMapsModule]
})
export class InfoWindowComponent  implements OnInit {

  constructor(public mapService:MapService) { }
  lat?:number;
  lng?:number;
  city?:string;
  coords!:google.maps.LatLngLiteral;

  directionsService!: google.maps.DirectionsService;
  directionsRenderer!: google.maps.DirectionsRenderer;
  directionOptions: google.maps.DirectionsRequest = {
    origin: { lat: 44.55577411467918, lng: 7.735974391878129 },
    destination: this.coords,
    travelMode: google.maps.TravelMode.DRIVING
  }

  ngOnInit() {
    setInterval(()=>{
      console.log(this.mapService.markerCoords)
    }, 1000)
    this.mapService.markerCoordsObservable.subscribe((marker:any)=>{
      this.lat = marker.coords.lat;
      this.lng = marker.coords.lng;
      this.city = marker.città;
      this.coords = marker.coords;
    })
    this.directionsService.route(this.directionOptions, (result, status) => {
      if (status === 'OK') {
        // this.directionsRenderer.setDirections(result);
        console.log("OK")
      }
    });
  }
  
  
}
