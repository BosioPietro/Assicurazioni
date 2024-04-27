import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ImmagineProfiloDefault } from 'src/app/comuni/immagine-profilo-default/immagine-profilo-default.component';
import { IonIcon } from '@ionic/angular/standalone'
import { ContenitoreNotificheComponent } from 'src/app/comuni/notifiche/contenitore-notifiche/contenitore-notifiche.component';
import { NotificheService } from 'src/app/comuni/notifiche/notifiche.service';
import Opzione from 'src/app/comuni/elementi-form/dropdown/opzione.model';
import { InputTextComponent } from 'src/app/comuni/elementi-form/input-text/input-text.component';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { RegexInput } from 'src/app/utils/Input';
import { DropdownComponent } from 'src/app/comuni/elementi-form/dropdown/dropdown.component';
import { FileUploadComponent } from 'src/app/comuni/elementi-form/file-upload/file-upload.component';
import { ModaleSiNoComponent } from 'src/app/comuni/modale-si-no/modale-si-no.component';
import { Perizia } from '../perizia.model';
import { GoogleMap, MapAdvancedMarker, MapMarker } from '@angular/google-maps';
import { FintoHrComponent } from 'src/app/comuni/finto-hr/finto-hr.component';
import { RicercaComponent } from 'src/app/comuni/elementi-form/ricerca/ricerca.component';
import { ModificaPeriziaService } from './modifica-perizia.service';
import { CaroselloComponent } from '../carosello/carosello.component';
import { TextareaComponent } from 'src/app/comuni/elementi-form/textarea/textarea.component';

@Component({
  selector: 'ModificaPeriziaModale',
  templateUrl: './modifica-perizia-modale.component.html',
  styleUrls: ['./modifica-perizia-modale.component.scss'],
  imports: [ImmagineProfiloDefault, IonIcon, ContenitoreNotificheComponent, 
            InputTextComponent, CalendarModule, FormsModule, DropdownComponent, 
            FileUploadComponent, ModaleSiNoComponent, GoogleMap, MapMarker, 
            MapAdvancedMarker, FintoHrComponent, RicercaComponent, CaroselloComponent,
            TextareaComponent],
  standalone: true,
})
export class ModificaPeriziaComponent implements AfterViewInit, OnInit{

  constructor(
    public servizio: ModificaPeriziaService,
    private notifiche: NotificheService
  ){}

  @Input()
  periziaVisualizzata!: Perizia;

  @Input()
  periziaModificata!: Perizia;

  @Output()
  onPeriziaModificata = new EventEmitter<Perizia>();

  @Output()
  onChiudi = new EventEmitter<void>();

  @ViewChild("modaleUtente")
  modale!: ElementRef<HTMLDialogElement>;

  @ViewChild("modaleElimina")
  modaleElimina!: ModaleSiNoComponent;

  @ViewChild("cercaIndirizzo")
  cercaIndirizzo!: ElementRef<InputTextComponent>;

  opzioniSiNo: Opzione[] = [
    { testo: "Sì", valore: "true" },
    { testo: "No", valore: "false" }
  ]

  opzioniRuolo: Opzione[] = [
    { testo: "Dipendente", valore: "Dipendente"},
    { testo: "Admin", valore: "Admin"}
  ]

  maps = window.google.maps;
  opzioni:any;

  coordinateVallauri = {
    lat: 44.555302,
    lng: 7.7363457
  }

  infoLuogo = {
    errori: {
      "info-coordinate": "",
      "info-provincia": "",
      "info-indirizzo":"",
      "info-citta": ""
    },
    modifica: false,
    uguali: true,
    valide: true,
    caricamento: false
  }

  regexInput = RegexInput;
  indiceFoto: number = 0;

  ngAfterViewInit() {
    this.modale.nativeElement.showModal();
  }

  google = window.google;

  async ngOnInit() {
    const { PinElement } = await this.maps.importLibrary("marker") as google.maps.MarkerLibrary;
    
    this.opzioni = new PinElement({
      "background": "#245c73",
      "borderColor": "#f2f3f5",
      "glyphColor": "#f2f3f5",
      "scale": 1.2,
    })
  }
  
  ricercaInCaricamento: boolean = false;
  opzioniRicerca: Opzione[] = [];
  async CercaIndirizzi(e: Event){
    const val = (e.target as HTMLInputElement).value;

    if(val.length < 3) return;

    this.ricercaInCaricamento = true;
    const risultati = await this.servizio.CercaIndirizzi(val);
    this.ricercaInCaricamento = false;

    if(this.servizio.ControllaErrore(risultati)){
      return;
    }

    this.opzioniRicerca = risultati.map((r: Record<string, any>) => {
      return { testo: r["description"], valore: r }
    });
  }

  async CambiaIndirizzo(opz: Opzione){
    this.infoLuogo.caricamento = true;
    const indirizzo = await this.Geocode(opz["valore"]);
    this.infoLuogo.caricamento = false;

    if(indirizzo == ""){
      this.notifiche.NuovaNotifica({
        titolo: "Errore",
        tipo: "errore",
        descrizione: "Errore nel trovare le coordinate",
      });
      return;
    }

    this.periziaModificata.luogo = {
      citta: indirizzo.address_components[2].long_name,
      provincia: indirizzo.address_components[4].short_name,
      indirizzo: indirizzo.formatted_address.split(",").slice(0, 2).join(",").trim(),
      coordinate: {
        lat: indirizzo.geometry.location.lat(),
        lng: indirizzo.geometry.location.lng()
      }
    }
  }

  navigator: any = window.navigator;

  async Geocode(posto: Record<string, any>){
    const geocoder = new this.google.maps.Geocoder();

    return new Promise<any>((resolve, reject) => {
      geocoder.geocode({ address : posto["description"] }, (results: Record<string, any>, status: string) => {
        if(status == "OK"){
          resolve(results[0]);
        } else {
          resolve("");
        }
      })
    })
  }

  caricamentoLocali: boolean = false;
  CoordinateLocali(){
    navigator.geolocation.getCurrentPosition(async (position) => {
      const indirizzo = await this.servizio.PrendiIndirizzo({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }) as any;

      if(!indirizzo){
        this.notifiche.NuovaNotifica({
          titolo: "Errore",
          tipo: "errore",
          descrizione: "Errore nel trovare le coordinate",
        });
        return;
      }
      

      this.periziaModificata.luogo = {
        citta: indirizzo.address_components[2].long_name,
        provincia: indirizzo.address_components[4].short_name,
        indirizzo: indirizzo.formatted_address.split(",").slice(0, 2).join(",").trim(),
        coordinate: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      }
      
    });
  }

  PrendiImmagini(){
    return structuredClone(this.periziaModificata.immagini);
  }

  ChiudiModale(){
    this.modale.nativeElement.classList.add("chiudi");
    setTimeout(() => {
      this.modale.nativeElement.close()
      this.modale.nativeElement.classList.remove("chiudi");
      this.onChiudi.emit();
    }, 301);
  }
}
