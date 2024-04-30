import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone'
import Utente from '../tabella-utenti/utente.model';
import { ContenitoreNotificheComponent } from 'src/app/comuni/notifiche/contenitore-notifiche/contenitore-notifiche.component';
import { ModaleSiNoComponent } from 'src/app/comuni/modale-si-no/modale-si-no.component';
import { ImmagineProfiloDefault } from 'src/app/comuni/immagine-profilo-default/immagine-profilo-default.component';
import { RegexInput } from 'src/app/utils/Input';
import { InputTextComponent } from 'src/app/comuni/elementi-form/input-text/input-text.component';
import { FormsModule } from '@angular/forms';
import { DropdownComponent } from 'src/app/comuni/elementi-form/dropdown/dropdown.component';
import Opzione from 'src/app/comuni/elementi-form/dropdown/opzione.model';
import { FileUploadComponent } from 'src/app/comuni/elementi-form/file-upload/file-upload.component';
import { CalendarModule } from 'primeng/calendar';
import { NotificheService } from 'src/app/comuni/notifiche/notifiche.service';

@Component({
  selector: 'AggiungiUtenteModale',
  templateUrl: './aggiungi-utente-modale.component.html',
  styleUrls: ['./aggiungi-utente-modale.component.scss'],
  imports: [IonIcon, ContenitoreNotificheComponent, ModaleSiNoComponent, ImmagineProfiloDefault,
            InputTextComponent, FormsModule, DropdownComponent, FileUploadComponent, CalendarModule],
  standalone: true,
})
export class AggiungiUtenteModaleComponent implements AfterViewInit {

  constructor(private notifiche: NotificheService) { }

  @Input()
  caricamento!: boolean;

  @Output()
  onChiudi = new EventEmitter<void>();

  @Output()
  onAggiungi = new EventEmitter<Utente>();

  @ViewChild("modaleUtente")
  modale!: ElementRef<HTMLDialogElement>;

  @ViewChild("modaleElimina")
  modaleElimina!: ModaleSiNoComponent;
  
  ngAfterViewInit() {
    this.modale.nativeElement.showModal();
  }

  utente: Utente = {
    nome: "",
    cognome: "",
    username: "",
    email: "",
    telefono: "",
    ruolo: "Dipendente",
    pfp: "",
    "2FA": false,
    nPerizie: 0,
    assuntoIl: this.DataInStringa(new Date()),
    attivo: false,
    genere: "M"
  }

  infoPersonali = {
    errori: {
      "info-nome": "",
      "info-cognome": "",
      "info-username": "",
      "info-mail": "",
      "info-telefono": "",
      "info-2FA": ""
    },
    valide: false,
  }

  regexInput = RegexInput;

  opzioniSiNo: Opzione[] = [
    { testo: "Sì", valore: "true" },
    { testo: "No", valore: "false" }
  ]

  opzioniRuolo: Opzione[] = [
    { testo: "Dipendente", valore: "Dipendente"},
    { testo: "Admin", valore: "Admin"}
  ]

  ChiudiModale(){
    this.modale.nativeElement.classList.add("chiudi");
    setTimeout(() => {
      this.modale.nativeElement.close()
      this.modale.nativeElement.classList.remove("chiudi");
      this.onChiudi.emit();
    }, 301);
  }

  ResettaErrori(){
    const chiavi = Object.keys(this.infoPersonali.errori) as any;

    chiavi.forEach((c: keyof typeof this.infoPersonali.errori) => this.infoPersonali.errori[c] = "")
  }


  ResettaInfoPersonali(){
    this.ResettaErrori();
    (document.activeElement as HTMLElement).blur()

    this.utente!["nome"] = ""
    this.utente!["cognome"] = ""
    this.utente!["username"] = ""
    this.utente!["email"] = ""
    this.utente!["telefono"] = ""
    this.utente!["2FA"] = false
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
            if(valore){
              this.infoPersonali.errori["info-telefono"] = "Numero non valido";
            }

            this.utente['2FA'] = false;
        } 
      break;
      default:
        break;
    }
    this.ControllaErroriPersonali();
  }

  ControllaErroriPersonali(){
    this.infoPersonali.valide = Object.values(this.infoPersonali.errori).every(e => !e);
  }

  ResettaInfoLavoro(){
    (document.activeElement as HTMLElement).blur()

    this.utente["assuntoIl"] = ""
    this.utente["ruolo"] = "Dipendente"
    this.utente["attivo"] = false
  }

  DataInStringa(data: Date){
    const giorno = data.getDate().toString().padStart(2, "0");
    const mese = (data.getMonth() + 1).toString().padStart(2, "0");
    const anno = data.getFullYear();

    return `${anno}-${mese}-${giorno}`
  }

  ControllaRuolo(){
    if(this.utente.ruolo == "Admin" && this.utente['2FA'] == false){
      this.notifiche.NuovaNotifica({
        "titolo": "Ruolo non valido",
        "descrizione": "Non puoi assegnare il ruolo di Admin ad un utente senza 2FA",
        "tipo": "errore"
      })

      setTimeout(() => this.utente.ruolo = "Dipendente");
    }
  }
}
