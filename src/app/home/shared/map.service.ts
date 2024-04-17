import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UtilityService } from './utility.service';
@Injectable({
  providedIn: 'root'
})
export class MapService {
  markerCoordsObservable = new Subject<any>();
  flagInfoWindow:boolean = false;
  selectedOperators:any []= [];
  markers: google.maps.Marker[] = [];
  constructor(public utilityService:UtilityService) { }
  markerCoords:any;
  newMarker:any;
  map?:google.maps.Map;
  mapRecipient:any;
  center: google.maps.LatLngLiteral = { lat: 44.55577411467918, lng: 7.735974391878129 }
  zoom:number = 13
  creaMappa(){
    this.markers.forEach(marker => {
      marker.setMap(null);
    });
    this.markerList.forEach(marker => {
      if((this.selectedOperators.includes(marker.utente.nome) && (marker.utente.genere == this.utilityService.flagRadioClicked || this.utilityService.flagRadioClicked == "All")) || this.selectedOperators.length == 0 || (this.utilityService.flagRadioClicked == "All" && this.selectedOperators.length == 0) || (this.utilityService.flagRadioClicked == marker.utente.genere && this.selectedOperators.length == 0)){
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
        this.markers.push(this.newMarker)
      }
    });
    this.newMarker.addListener('click', ()=>{
      // this.mapService.flagInfoWindow = true;
      // this.mapService.markerCoordsObservable.next(marker);
  })
  }
  mapOptions = {
    zoomControl: false,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    center: this.center,
    zoom: this.zoom
  };
  markerList = [
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
        "utente": {"nome": "Franco", "genere": "M"},
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
        "utente": {"nome": "Giovanna", "genere": "F"},
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
        "utente": {"nome": "Piero", "genere": "M"},
        "colore": "green"
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
        "utente": {"nome": "Guglielmo", "genere": "M"},
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
        "utente": {"nome": "Giovanna", "genere": "F"},
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
        "utente": {"nome": "Franco", "genere": "M"},
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
        "utente": {"nome": "Giovanna", "genere": "F"},
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
        "utente": {"nome": "Piero", "genere": "M"},
        "colore": "green"
    }
]
}
