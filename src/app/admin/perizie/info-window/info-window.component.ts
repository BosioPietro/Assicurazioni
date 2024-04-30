import { NgClass, NgIf } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { MapService } from '../shared/map.service';

@Component({
  selector: 'InfoWindow',
  templateUrl: './info-window.component.html',
  styleUrls: ['./info-window.component.scss'],
  standalone: true,
  imports: [GoogleMapsModule, NgIf, NgClass]
})
export class InfoWindowComponent{
  @ViewChild('mapElement') mapElement!: any;
  map?: google.maps.Map;
  constructor(public mapService:MapService) { }
  lat?:number;
  lng?:number;
  city?:string;
  coords!:google.maps.LatLngLiteral;
  mapOptions!: google.maps.MapOptions;
  travelDuration?:string;
  user?:string;
  date?:string;

  directionsService!: google.maps.DirectionsService;
  directionsRenderer!: google.maps.DirectionsRenderer;
  directionOptions!: google.maps.DirectionsRequest;
  chiudiInfoWindow(){
    this.mapService.flagInfoWindow = false;
  }
  google = window.google;
  ngAfterViewInit() {
    this.directionsService = new this.google.maps.DirectionsService();
    this.directionsRenderer = new this.google.maps.DirectionsRenderer({
      polylineOptions: {
        strokeColor: 'pink',
        strokeOpacity: 1,
        strokeWeight: 7
      }
    });
    this.mapOptions = {
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      center: this.coords,
      zoom: 10

    };
    
    this.map = new this.google.maps.Map(this.mapElement.nativeElement, this.mapOptions);
    this.directionsRenderer.setMap(this.map!);
    // this.mapService.markerCoordsObservable.subscribe((marker:any)=>{
    //   this.mapService.flagInfoWindow = true;
    //   this.lat = marker.coords.lat;
    //   this.lng = marker.coords.lng;
    //   this.city = marker.città;
    //   this.coords = marker.coords;
    //   this.user = marker.utente;
    //   this.date = marker.data.date;

    //   this.directionOptions = {
    //     origin: { lat: 44.55577411467918, lng: 7.735974391878129 },
    //     destination: this.coords,
    //     travelMode: this.google.maps.TravelMode.DRIVING
    //   }
  
    //   this.directionsService.route(this.directionOptions, (result, status: google.maps.DirectionsStatus) => {
    //     if (status === 'OK' && result) {
    //       this.directionsRenderer.setDirections(result);
    //       this.travelDuration = result.routes[0].legs[0].duration?.text;
    //     }
    //   });
    // })
  }
  
  
}
