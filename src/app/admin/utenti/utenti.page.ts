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
import Opzione from 'src/app/comuni/elementi-form/dropdown/opzione.model';
import { RegexInput } from 'src/app/utils/Input';
import { CalendarModule } from 'primeng/calendar';
import { PrimeNGConfig } from 'primeng/api';
import { Router } from '@angular/router';
import { ControllaToken } from 'src/app/utils/funzioni';
import Utente from './tabella-utenti/utente.model';

@Component({
  selector: 'Utenti',
  templateUrl: './utenti.page.html',
  styleUrls: ['./utenti.page.scss'],
  animations: [animazione],
  imports: [IonicModule, CommonModule, FormsModule, BottoniOpzioneComponent, BarraRicercaComponent, TabellaUtentiComponent, MenuModule, ImmagineProfiloDefault, InputTextComponent, DropdownComponent, ReactiveFormsModule, CalendarModule],
  standalone: true,
})
export class UtentiPage implements OnInit{

  @ViewChild("modaleElimina")
  modaleElimina!: ElementRef<HTMLDialogElement>;

  @ViewChild("modaleUtente")
  modaleUtente!: ElementRef<HTMLDialogElement>;

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


  opzioniSiNo: Opzione[] = [
    { testo: "Sì", valore: "true" },
    { testo: "No", valore: "false" }
  ]

  opzioniRuolo: Opzione[] = [
    { testo: "Dipendente", valore: "Dipendente"},
    { testo: "Admin", valore: "Admin"}
  ]

  infoPersonali = {
    errori: {
      "info-nome": "",
      "info-cognome": "",
      "info-username": "",
      "info-mail": "",
      "info-telefono": "",
      "info-2FA": ""
    },
    modifica: false,
    uguali: true,
    valide: true,
    caricamento: false
  }

  infoLavoro = {
    uguali: true,
    modifica: false,
  }

  CambiaMod(s: string){
    this.tabella.tipo = s;
  }

  opzioniDipendenti = [
    {nome: "Tutti", val: "Tutti"}, 
    {nome: "Admin", val: "Admin"},
    {nome: "Dipendenti", val: "Dipendente"}
  ]

  public regexInput = RegexInput;

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

  ConfermaElimina(){
    this.modaleElimina.nativeElement.showModal();
  }

  ChiudiModale(modale: HTMLDialogElement){

    modale.classList.add("chiudi");
    setTimeout(() => {
      modale.close()
      modale.classList.remove("chiudi");
      this.tabella.utenteVisualizzato = undefined;
    }, 301);
  }

  async EliminaUtenti(){
    this.ChiudiModale(this.modaleElimina.nativeElement);
    const res = await this.tabella.EliminaUtenti();

    if(res == false)
    {
      this.notifiche.NuovaNotifica({
        titolo: "Qualcosa è andato storto",
        descrizione: "Non è stato effettuare l'operazione richiesta",
        tipo: "errore"
      })
      return;
    }

    if(typeof res == "string"){
      this.notifiche.NuovaNotifica({
        titolo: "Qualcosa è andato storto",
        descrizione: res,
        tipo: "errore"
      })
      return;
    }

    if(await this.tabella.Carica())return;

    this.notifiche.NuovaNotifica({
      titolo: "Qualcosa è andato storto",
      descrizione: "Non è stato possibile recuperare gli utenti dal server",
      tipo: "errore"
    })
  }

  MostraPannelloUtente(){
    this.tabella.utenteModificato = structuredClone(this.tabella.utenteVisualizzato);

    setTimeout(() => this.modaleUtente.nativeElement.showModal());
  }

  ResettaInfoPersonali(){
    this.ResettaErrori();
    (document.activeElement as HTMLElement).blur()

    const clone = structuredClone(this.tabella.utenteVisualizzato);
    this.tabella.utenteModificato!["nome"] = clone!["nome"]
    this.tabella.utenteModificato!["cognome"] = clone!["cognome"]
    this.tabella.utenteModificato!["username"] = clone!["username"]
    this.tabella.utenteModificato!["email"] = clone!["email"]
    this.tabella.utenteModificato!["telefono"] = clone!["telefono"]
    this.tabella.utenteModificato!["2FA"] = clone!["2FA"]

    this.infoPersonali.modifica = false;  
  }

  ResettaInfoLavoro(){
    (document.activeElement as HTMLElement).blur()
    const clone = structuredClone(this.tabella.utenteVisualizzato);

    this.tabella.utenteModificato!["assuntoIl"] = clone!["assuntoIl"]
    this.tabella.utenteModificato!["ruolo"] = clone!["ruolo"]
    this.tabella.utenteModificato!["attivo"] = clone!["attivo"]
    
    this.infoLavoro.modifica = false;
  }

  ResettaErrori(){
    const chiavi = Object.keys(this.infoPersonali.errori) as any;

    chiavi.forEach((c: keyof typeof this.infoPersonali.errori) => this.infoPersonali.errori[c] = "")
  }


  VerificaInputPersonali(e: Event){
    const input = e.target as HTMLInputElement;
    const valore = input.value

    switch(input.name){
      case "info-nome":
        if(!valore)
        {
            this.infoPersonali.errori["info-nome"] = "Nome non valido"
        } 
      break;
      case "info-cognome":
        if(!valore)
        {
          this.infoPersonali.errori["info-cognome"] = "Cognome non valido"
        } 
      break;
      case "info-username":
        if(!RegexInput["username"].test(valore))
        {
          this.infoPersonali.errori["info-username"] = "Username non valido"
        } 
      break;
      case "info-mail":
        if(!RegexInput["email"].test(valore))
        {
          this.infoPersonali.errori["info-nome"] = "E-Mail non valida"
        } 
      break;
      case "info-telefono":
        if(!RegexInput["telefono"].test(valore))
        {
            if(!valore){
              this.infoPersonali.errori["info-telefono"] = "Numero non valido";
            }

            this.tabella.utenteModificato!['2FA'] = false;
        } 
      break;
      default:
        break;
    }
    this.ControllaErroriPersonali();
  }

  ControllaUgualiPersonali(){
    this.infoPersonali.uguali = Object.entries(this.tabella.utenteModificato!).every(([k, v]) => {
      return v === this.tabella.utenteVisualizzato![k as keyof Utente] || !["nome", "cognome", "email" ,"telefono", "2FA"].includes(k);
    });
  }

  ControllaErroriPersonali(){
    this.infoPersonali.valide = Object.values(this.infoPersonali.errori).every(e => !e);
    this.ControllaUgualiPersonali();
  }

  ControllaUgualiLavoro(){
    console.log(this.tabella.utenteModificato)
    this.infoLavoro.uguali = Object.entries(this.tabella.utenteModificato!).every(([k, v]) => {
      return v === this.tabella.utenteVisualizzato![k as keyof Utente] || !["ruolo", "assuntoIl", "attivo"].includes(k);
    });
  }

}
