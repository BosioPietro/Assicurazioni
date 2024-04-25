import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BottoniOpzioneComponent } from 'src/app/comuni/elementi-form/opzioni/opzioni.component';
import { BarraRicercaComponent } from 'src/app/comuni/elementi-form/barra-ricerca/barra-ricerca.component';
import { TabellaUtentiComponent } from './tabella-utenti/tabella-utenti.component';
import { TabellaService } from './tabella.service';
import { MenuModule } from 'primeng/menu';
import { animazione } from 'src/app/comuni/animazioni/appari-disappari';
import { MenuItem } from 'primeng/api';
import { NotificheService } from 'src/app/comuni/notifiche/notifiche.service';
import { ImmagineProfiloDefault } from 'src/app/comuni/immagine-profilo-default/immagine-profilo-default.component';
import { InputTextComponent } from 'src/app/comuni/elementi-form/input-text/input-text.component';
import { DropdownComponent } from 'src/app/comuni/elementi-form/dropdown/dropdown.component';
import { RegexInput } from 'src/app/utils/Input';
import { CalendarModule } from 'primeng/calendar';
import { PrimeNGConfig } from 'primeng/api';
import { Router } from '@angular/router';
import { ControllaToken } from 'src/app/utils/funzioni';
import { ContenitoreNotificheComponent } from 'src/app/comuni/notifiche/contenitore-notifiche/contenitore-notifiche.component';
import Utente from './tabella-utenti/utente.model';
import { EliminaUtenteModaleComponent } from '../elimina-utente-modale/elimina-utente-modale.component';
import { ModificaUtenteModaleComponent } from '../modifica-utente-modale/modifica-utente-modale.component';

@Component({
  selector: 'Utenti',
  templateUrl: './utenti.page.html',
  styleUrls: ['./utenti.page.scss'],
  animations: [animazione],
  imports: [IonicModule, CommonModule, FormsModule, BottoniOpzioneComponent, BarraRicercaComponent, 
            TabellaUtentiComponent, MenuModule, ImmagineProfiloDefault, InputTextComponent, DropdownComponent, 
            ReactiveFormsModule, CalendarModule, ContenitoreNotificheComponent, EliminaUtenteModaleComponent,
            ModificaUtenteModaleComponent],
  standalone: true,
})
export class UtentiPage implements OnInit{

  constructor(
    public tabella: TabellaService, 
    private notifiche: NotificheService,
    private config: PrimeNGConfig,
    private router: Router
  ) { }

  ngOnInit() {
    ControllaToken(this.router);
    
    this.config.setTranslation({
      accept: 'Accept',
      reject: 'Cancel',
      "monthNames" : ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
      "monthNamesShort" : ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"],
      "dayNames" : ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"],
      "dayNamesShort" : ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"],
      "dayNamesMin" : ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"],
      "today": 'Oggi',
      "clear": 'Pulisci',
      "weekHeader": 'Settimana'
    });
  }

  public regexInput = RegexInput;

  opzioneElimina: MenuItem = {
    label: 'Elimina',
    icon: 'pi pi-fw pi-trash',
    command: () => this.ConfermaElimina()
  }

  opzioneCreaGruppo: MenuItem  = {
    label: 'Crea Gruppo',
    icon: 'pi pi-fw pi-users'
  }

  opzioneCreaChat: MenuItem  = {
    label: 'Crea Chat',
    icon: 'pi pi-fw pi-comment'
  }

  opzioniDipendenti = [
    {nome: "Tutti", val: "Tutti"}, 
    {nome: "Admin", val: "Admin"},
    {nome: "Dipendenti", val: "Dipendente"}
  ]

  vuoleEliminare: boolean = false;
  
  CambiaMod(s: string){
    this.tabella.tipo = s;
  }

  EsportaCSV(){
    const file = this.tabella.tutti.reduce((acc, curr) => {
      return `${acc}${Object.values(curr).join(",")}\n`;
    }, "data:text/csv;charset=utf-8,");

    const link = Object.assign(document.createElement("a"), {
      href: encodeURI(file),
      download: "utenti.csv"
    });
    
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  ConfermaElimina(){
    this.vuoleEliminare = true;
  }

  MostraPannelloUtente(){
    this.tabella.utenteModificato = structuredClone(this.tabella.utenteVisualizzato);
  }

  async CaricaTabella(){
    if(await this.tabella.Carica())return;

    this.notifiche.NuovaNotifica({
      titolo: "Qualcosa è andato storto",
      descrizione: "Non è stato possibile recuperare gli utenti dal server",
      tipo: "errore"
    })
  }

  ChiudiElimina(){
    this.vuoleEliminare = false;
    this.tabella.selezionati = [];
  }

  ErroreElimina(codice: number){
    switch(codice){
      case 405:
        this.notifiche.NuovaNotifica({
          tipo: "errore",
          titolo: "Non autorizzato",
          descrizione: "Non hai i permessi per effettuare questa operazione"
        })
      break;
      case 500:
        this.notifiche.NuovaNotifica({
          tipo: "errore",
          "titolo": "Errore del server",
          "descrizione": "Qualcosa è andato storto"
        })
      break;
    }
    this.ChiudiElimina();
  }

  async GestisciEliminati(){
    await this.CaricaTabella();
    this.ChiudiElimina();
  }

  ChiudiModifica(){
    this.tabella.utenteModificato = undefined;
    this.tabella.utenteVisualizzato = undefined;
  }

}
