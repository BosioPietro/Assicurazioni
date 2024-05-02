import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone'
import { ContenitoreNotificheComponent } from 'src/app/comuni/notifiche/contenitore-notifiche/contenitore-notifiche.component';
import { NotificheService } from 'src/app/comuni/notifiche/notifiche.service';
import Opzione from 'src/app/comuni/elementi-form/dropdown/opzione.model';
import { InputTextComponent } from 'src/app/comuni/elementi-form/input-text/input-text.component';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { RegexInput } from 'src/app/utils/Input';
import { DropdownComponent } from 'src/app/comuni/elementi-form/dropdown/dropdown.component';
import { GoogleMap, MapAdvancedMarker, MapMarker } from '@angular/google-maps';
import { FintoHrComponent } from 'src/app/comuni/finto-hr/finto-hr.component';
import { Errore, RicercaComponent } from 'src/app/comuni/elementi-form/ricerca/ricerca.component';
import { CreaPeriziaService } from './crea-perizia.service';
import { DataInStringa } from 'src/app/utils/funzioni';
import { Perizia } from '../../perizia/perizia.model';

@Component({
  selector: 'CreaPeriziaModale',
  templateUrl: './crea-perizia-modale.component.html',
  styleUrls: ['./crea-perizia-modale.component.scss', '../../../comuni/elementi-form/stile-mappa.scss', '../../../comuni/elementi-form/stile-calendario.scss'],
  imports: [IonIcon, ContenitoreNotificheComponent,
            InputTextComponent, CalendarModule, FormsModule, DropdownComponent, 
            GoogleMap, MapMarker, MapAdvancedMarker, FintoHrComponent, 
            RicercaComponent],
  standalone: true,
})
export class CreaPeriziaComponent implements AfterViewInit, OnInit{

  constructor(
    private notifiche: NotificheService,
    private servizio: CreaPeriziaService
  ){}

  @Input()
  operatori!: Record<string, any>[];

  @Input()
  perizie!: Perizia[];

  @Input()
  caricamento!: boolean;

  @Output()
  onChiudi = new EventEmitter<void>();

  @Output()
  onAggiungi = new EventEmitter<Perizia>();

  @ViewChild("modaleUtente")
  modale!: ElementRef<HTMLDialogElement>;

  @ViewChild("cercaIndirizzo")
  cercaIndirizzo!: ElementRef<HTMLElement>;

  periziaCreata: any = {
    data: DataInStringa(new Date()),
    codOperatore: "",
    luogo: {}
  }

  maps = window.google.maps;
  opzioni:any;

  coordinateVallauri = {
    lat: 44.555302,
    lng: 7.7363457
  }

  infoLuogo = {
    caricamento: false
  }

  regexInput = RegexInput;

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

    this.periziaCreata["luogo"] = {
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
      

      this.periziaCreata.luogo = {
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

  ChiudiModale(){
    this.modale.nativeElement.classList.add("chiudi");
    setTimeout(() => {
      this.modale.nativeElement.close()
      this.modale.nativeElement.classList.remove("chiudi");
      this.onChiudi.emit();
    }, 301);
  }

  Errore(res: Errore){
    this.notifiche.NuovaNotifica({
      titolo: "Errore",
      descrizione: res.messaggio || "Qualcosa è andato storto",
      tipo: "errore"
    })
  }

  PrendiOpzioniOperatori(): Opzione[]{
    return this.operatori.map((o: Record<string, any>) => {
      return { testo: `${o["cognome"]} ${o["nome"]}`, valore: o["username"] }
    });
  }

  Aggiungi(){
    const codice = Math.max(...this.perizie.map((p) => +p.codice)) + 1;

    this.onAggiungi.emit({
      codice,
      data: this.periziaCreata.data,
      codOperatore: this.periziaCreata.codOperatore,
      luogo: this.periziaCreata.luogo,
      immagini: [],
      descrizione: "",
    });
  }
}
