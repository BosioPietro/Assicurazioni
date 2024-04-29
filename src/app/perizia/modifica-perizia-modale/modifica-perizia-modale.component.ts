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
import { Errore, RicercaComponent } from 'src/app/comuni/elementi-form/ricerca/ricerca.component';
import { ModificaPeriziaService } from './modifica-perizia.service';
import { CaroselloComponent } from '../carosello/carosello.component';
import { TextareaComponent } from 'src/app/comuni/elementi-form/textarea/textarea.component';
import { DataInStringa } from 'src/app/utils/funzioni';

@Component({
  selector: 'ModificaPeriziaModale',
  templateUrl: './modifica-perizia-modale.component.html',
  styleUrls: ['./modifica-perizia-modale.component.scss','../../comuni/stile-mappa.scss', '../../comuni/elementi-form/stile-calendario.scss'],
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

  @Input()
  operatori!: Record<string, any>[];

  @Output()
  onPeriziaModificata = new EventEmitter<Perizia>();

  @Output()
  onChiudi = new EventEmitter<void>();

  @ViewChild("modaleUtente")
  modale!: ElementRef<HTMLDialogElement>;

  @ViewChild("modaleElimina")
  modaleElimina!: ModaleSiNoComponent;

  @ViewChild("cercaIndirizzo")
  cercaIndirizzo!: ElementRef<HTMLElement>;

  @ViewChild("immagini")
  immagini!: ElementRef<HTMLElement>;

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
    modifica: false,
    caricamento: false
  }

  infoImmagini = {
    modifica: false,
    caricamento: false
  }

  infoGenerali = {
    modifica: false,
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

  ResettaInfo(mod: "luogo"|"immagini"|"generali"){
    switch(mod){
      case "luogo":
        this.periziaModificata.luogo = structuredClone(this.periziaVisualizzata.luogo);
        this.infoLuogo.modifica = false;
        break;
      case "immagini":
        this.periziaModificata.immagini = structuredClone(this.periziaVisualizzata.immagini);
        this.infoImmagini.modifica = false;
        break;
      case "generali":
        this.periziaModificata = Object.assign(structuredClone(this.periziaModificata), {
          codOperatore: this.periziaModificata.codOperatore,
          data: this.periziaModificata.data,
        });
        this.infoGenerali.modifica = false;
        break;
    }
  }

  async AggiornaUtente(mod: "luogo"|"immagini"|"generali"){

    switch(mod){
      case "luogo":
        {
          this.infoLuogo.caricamento = true;

          const nuovaPerizia = Object.assign(structuredClone(this.periziaVisualizzata), { luogo: structuredClone(this.periziaModificata.luogo) });
          const res = await this.servizio.ModificaPerizia(nuovaPerizia);

          if(!this.servizio.ControllaErrore(res))
          {
            this.notifiche.NuovaNotifica({
              titolo: "Perizia modificata",
              descrizione: "La perizia è stata modificata con successo",
              tipo: "info"
            })
          }
          else this.Errore(res);
          

          this.periziaVisualizzata = nuovaPerizia;   
          
          this.infoLuogo.caricamento = false;
        }
        break;
      case "immagini":
        {
          this.infoImmagini.caricamento = true;


          const nuovaPerizia = Object.assign(structuredClone(this.periziaVisualizzata), { immagini: structuredClone(this.periziaModificata.immagini) });
          const res = await this.servizio.ModificaPerizia(nuovaPerizia);
          
          if(!this.servizio.ControllaErrore(res))
            {
              this.notifiche.NuovaNotifica({
                titolo: "Perizia modificata",
                descrizione: "La perizia è stata modificata con successo",
                tipo: "info"
              })
            }
            else this.Errore(res);

          this.periziaVisualizzata = nuovaPerizia;
          this.infoImmagini.caricamento = false;
        }
        break;
      case "generali":
        {
          this.infoGenerali.caricamento = true;

          const operatore = this.operatori.find((o: Record<string, any>) => o["username"] == this.periziaModificata.codOperatore)!;

          const nuovaPerizia = Object.assign(structuredClone(this.periziaVisualizzata), {
            codOperatore: this.periziaModificata.codOperatore,
            data: typeof this.periziaModificata.data == "string" ? this.periziaModificata.data : DataInStringa(this.periziaModificata.data),
            nomeOperatore: `${operatore["cognome"]} ${operatore["nome"]}`
          });

          const res = await this.servizio.ModificaPerizia(nuovaPerizia);
          if(!this.servizio.ControllaErrore(res))
            {
              this.notifiche.NuovaNotifica({
                titolo: "Perizia modificata",
                descrizione: "La perizia è stata modificata con successo",
                tipo: "info"
              })
            }
            else this.Errore(res);
          this.infoGenerali.caricamento = false;
          this.periziaVisualizzata = nuovaPerizia;
        }
        break;
    }

    this.onPeriziaModificata.emit(structuredClone(this.periziaVisualizzata));
  }

  Errore(res: Errore){
    this.notifiche.NuovaNotifica({
      titolo: "Errore",
      descrizione: res.messaggio || "Qualcosa è andato storto",
      tipo: "errore"
    })
  }

  vuoleEliminareImmagine: boolean = false;
  CancellaImmagine(m: HTMLDialogElement){

    this.periziaModificata.immagini.splice(this.indiceFoto, 1);

    this.ChiudiModaleElimina(m);
  }

  ChiudiModaleElimina(m: HTMLDialogElement){
    m.classList.add("chiudi");
    setTimeout(() => {
      m.close()
      m.classList.remove("chiudi");
      this.vuoleEliminareImmagine = false;
    }, 301);
  }

  vuoleAggiungereImmagine: boolean = false;
  inCaricamentoAggiungiImmagine: boolean = false;
  CaricaImmagine(e: File){
    this.inCaricamentoAggiungiImmagine = true;

    this.servizio.CaricaImmaginePerizia(e)
    .then((res: any) => {
      if(isNaN(res)){
        this.inCaricamentoAggiungiImmagine = false;
        this.vuoleAggiungereImmagine = false;

        const url = res["secure_url"];
        this.periziaModificata.immagini.unshift({ url, commento: "" });
      }
      else{
        this.notifiche.NuovaNotifica({
          titolo: "Qualcosa è andato storto",
          descrizione: "Non è stato possibile completare l'operazione richiesta",
          tipo: "errore"
        })
      }
    })
  }

  ChiudiModaleUpload(m: HTMLDialogElement){
    m.classList.add("chiudi");
    setTimeout(() => {
      m.close()
      m.classList.remove("chiudi");
      this.vuoleAggiungereImmagine = false;
    }, 301);
  }

  PrendiOpzioniOperatori(): Opzione[]{
    return this.operatori.map((o: Record<string, any>) => {
      return { testo: `${o["cognome"]} ${o["nome"]}`, valore: o["username"] }
    });
  }

  Focus(s: "indirizzo" | "immagini"){
    setTimeout(() => {
      switch(s){
        case "indirizzo":
          {  
            const input: HTMLElement | null = this.cercaIndirizzo.nativeElement.querySelector("InputText input");
            input?.focus();
          }
          break;
          case "immagini":
          {
            const input = this.immagini.nativeElement.querySelector("textarea");
            input?.focus();
          }
          break;
      }
    }, 100);
  }
}
