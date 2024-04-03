import { Component, ViewChild } from '@angular/core';
import { GoogleMapsModule, MapAdvancedMarker } from '@angular/google-maps';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { DataStorageService } from '../shared/data-storage.service';
import { InfoWindowComponent } from './info-window/info-window.component';
import { MapService } from '../shared/map.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, GoogleMapsModule, InfoWindowComponent, NgClass],
})
export class HomePage {
  @ViewChild('mapElement') mapElement: any;
  constructor(private dataStorage: DataStorageService, public mapService:MapService) {}
  vallauri:string = "../assets/icon/vallauri.png"
  markerList:any[] = [];
  map?:google.maps.Map;
  mapOptions:any;
  newMarker:any;
  //map options
  center: google.maps.LatLngLiteral = { lat: 44.55577411467918, lng: 7.735974391878129 }
  zoom:number = 13
  directionService?: google.maps.DirectionsService;
  //marker
  ngAfterViewInit(){
    this.mapOptions = {
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        center: this.center,
        zoom: this.zoom
      };
      
      this.map = new google.maps.Map(this.mapElement.nativeElement, this.mapOptions);
      this.markerList.forEach(marker => {
        this.newMarker = new google.maps.Marker({
            position: marker.coords,
            map: this.map,
            icon: {
                path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
                fillColor: marker.colore,
                fillOpacity: 1,
                strokeColor: 'black',
                strokeWeight: 2,
                scale: 1
            }
        });
        this.newMarker.addListener('click', ()=>{
            this.mapService.flagInfoWindow = true;
            this.mapService.markerCoordsObservable.next(marker);
        })
    });
  }
  ngOnInit(){
    // this.dataStorage.inviaRichiesta("get", "/Perizie")?.subscribe((res)=>{
    //   console.log("OK")
    //   console.log(res);
    //   this.markerList = res;
    // })
    this.markerList = [
        {
            "città": "Fossano",
            "coords": {"lat": 44.5523731929605, "lng": 7.721713232773531},
            "data": {
                "giorno": "Lunedì",
                "mese": "Giugno",
                "anno": 2020,
                "date": "01/06/2020"
            },
            "ora": "10:30",
            "descrizione": "Valutazione dei danni strutturali in un edificio residenziale.",
            "immagini": ["https://example.com/danni_strutturali_1.jpg", "https://example.com/danni_strutturali_2.jpg"],
            "utente": "Franco",
            "colore": "blue"
        },
        {
            "città": "Fossano",
            "coords": {"lat": 44.55079932397518, "lng": 7.72894500967683},
            "data": {
                "giorno": "Giovedì",
                "mese": "Febbraio",
                "anno": 2022,
                "date": "13/02/2022"
            },
            "ora": "14:15",
            "descrizione": "Perizia tecnica su un incidente stradale.",
            "immagini": ["https://example.com/incidente_stradale_1.jpg", "https://example.com/incidente_stradale_2.jpg"],
            "utente": "Giovanni",
            "colore": "red"
        },
        {
            "città": "Scarnafigi",
            "coords": {"lat": 44.6817694598481, "lng": 7.569922421409666},
            "data": {
                "giorno": "Mercoledì",
                "mese": "Aprile",
                "anno": 2023,
                "date": "21/05/2023"
            },
            "ora": "9:30",
            "descrizione": "Valutazione della conformità normativa di un impianto industriale.",
            "immagini": ["https://example.com/conformita_normativa_1.jpg", "https://example.com/conformita_normativa_2.jpg"],
            "utente": "Piero",
            "colore": "greenyellow"
        },
        {
            "città": "Saluzzo",
            "coords": {"lat": 44.64707511066441, "lng": 7.499720382876884},
            "data": {
                "giorno": "Domenica",
                "mese": "Ottobre",
                "anno": 2024,
                "date": "28/10/2024"
            },
            "ora": "8:15",
            "descrizione": "Perizia di valutazione immobiliare per scopi fiscali.",
            "immagini": ["https://example.com/valutazione_immobiliare_1.jpg", "https://example.com/valutazione_immobiliare_2.jpg"],
            "utente": "Guglielmo",
            "colore": "orange"
        },
        {
            "città": "Saluzzo",
            "coords": {"lat": 44.64018257347816, "lng": 7.498800278742563},
            "data": {
                "giorno": "Domenica",
                "mese": "Dicembre",
                "anno": 2022,
                "date": "22/09/2022"
            },
            "ora": "17:22",
            "descrizione": "Perizia su danni causati da eventi atmosferici.",
            "immagini": ["https://example.com/danni_eventi_atmosferici_1.jpg", "https://example.com/danni_eventi_atmosferici_2.jpg"],
            "utente": "Giovanni",
            "colore": "red"
        },
        {
            "città": "Fossano",
            "coords": {"lat": 44.55010714003419, "lng": 7.7225220816183},
            "data": {
                "giorno": "Lunedì",
                "mese": "Novembre",
                "anno": 2023,
                "date": "13/02/2022"
            },
            "ora": "9:45",
            "descrizione": "Perizia di valutazione danni in un'area industriale.",
            "immagini": ["https://example.com/danni_industriali_1.jpg", "https://example.com/danni_industriali_2.jpg"],
            "utente": "Franco",
            "colore": "blue"
        },
        {
            "città": "Savigliano",
            "coords": {"lat": 44.64881849585665, "lng": 7.662144808499779},
            "data": {
                "giorno": "Venerdì",
                "mese": "Agosto",
                "anno": 2023,
                "date": "15/08/2023"
            },
            "ora": "10:20",
            "descrizione": "Perizia tecnica per un incidente in un cantiere edile.",
            "immagini": ["https://example.com/incidente_cantiere_1.jpg", "https://example.com/incidente_cantiere_2.jpg"],
            "utente": "Giovanni",
            "colore": "red"
        },
        {
            "città": "San Salvatore",
            "coords": {"lat": 44.6065723616791, "lng": 7.607579661496507},
            "data": {
                "giorno": "Sabato",
                "mese": "Venerdì",
                "anno": 2024,
                "date": "11/02/2024"
            },
            "ora": "11:20",
            "descrizione": "Perizia su danni strutturali causati da terremoto.",
            "immagini": ["https://example.com/danni_terremoto_1.jpg", "https://example.com/danni_terremoto_2.jpg"],
            "utente": "Piero",
            "colore": "greenyellow"
        }
    ]
  }
  onMarkerClick(event: google.maps.MapMouseEvent, marker: any){
    // this.mapService.markerCoords = JSON.stringify(marker.coords)
    this.mapService.markerCoordsObservable.next(marker);
    this.mapService.flagInfoWindow = true;

  }


}