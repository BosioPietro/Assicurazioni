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

@Component({
  selector: 'ModificaPeriziaModale',
  templateUrl: './modifica-perizia-modale.component.html',
  styleUrls: ['./modifica-perizia-modale.component.scss'],
  imports: [ImmagineProfiloDefault, IonIcon, ContenitoreNotificheComponent, 
            InputTextComponent, CalendarModule, FormsModule, DropdownComponent, 
            FileUploadComponent, ModaleSiNoComponent, GoogleMap, MapMarker, 
            MapAdvancedMarker, FintoHrComponent],
  standalone: true,
})
export class ModificaPeriziaComponent implements AfterViewInit, OnInit{

  constructor(
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
  cambioImmagine: boolean = false;
  caricamentoImmagine: boolean = false;
  inCaricamentoElimina: boolean = false;
  vuoleEliminare: boolean = false;

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
      "glyph": "🏠"
    })
  }

}
