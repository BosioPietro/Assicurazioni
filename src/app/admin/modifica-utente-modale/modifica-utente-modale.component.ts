import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ImmagineProfiloDefault } from 'src/app/comuni/immagine-profilo-default/immagine-profilo-default.component';
import { IonIcon } from '@ionic/angular/standalone'
import { ContenitoreNotificheComponent } from 'src/app/comuni/notifiche/contenitore-notifiche/contenitore-notifiche.component';
import Utente from '../utenti/tabella-utenti/utente.model';
import { NotificheService } from 'src/app/comuni/notifiche/notifiche.service';
import Opzione from 'src/app/comuni/elementi-form/dropdown/opzione.model';
import { InputTextComponent } from 'src/app/comuni/elementi-form/input-text/input-text.component';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { RegexInput } from 'src/app/utils/Input';
import { DropdownComponent } from 'src/app/comuni/elementi-form/dropdown/dropdown.component';
import { ModificaUtenteService } from './modifica-utente.service';
import { FileUploadComponent } from 'src/app/comuni/elementi-form/file-upload/file-upload.component';
import { ModaleSiNoComponent } from 'src/app/comuni/modale-si-no/modale-si-no.component';

@Component({
  selector: 'ModificaUtenteModale',
  templateUrl: './modifica-utente-modale.component.html',
  styleUrls: ['./modifica-utente-modale.component.scss', '../../comuni/elementi-form/stile-calendario.scss'],
  imports: [ImmagineProfiloDefault, IonIcon, ContenitoreNotificheComponent, 
            InputTextComponent, CalendarModule, FormsModule, DropdownComponent, 
            FileUploadComponent, ModaleSiNoComponent],
  standalone: true,
})
export class ModificaUtenteModaleComponent implements AfterViewInit{

  constructor(
    private utenti: ModificaUtenteService, 
    private notifiche: NotificheService
  ){}

  @Input()
  utenteVisualizzato!: Utente;

  @Input()
  utenteModificato!: Utente;

  @Output()
  onUtenteModificato = new EventEmitter<Utente>();

  @Output()
  onChiudi = new EventEmitter<void>();

  @Output()
  onImmagineCambiata = new EventEmitter<string>();

  @ViewChild("modaleUtente")
  modale!: ElementRef<HTMLDialogElement>;

  @ViewChild("modaleElimina")
  modaleElimina!: ModaleSiNoComponent;

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
    valido: false,
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

  ResettaInfoLavoro(){
    (document.activeElement as HTMLElement).blur()
    const clone = structuredClone(this.utenteVisualizzato);

    this.utenteModificato!["assuntoIl"] = clone!["assuntoIl"]
    this.utenteModificato!["ruolo"] = clone!["ruolo"]
    this.utenteModificato!["attivo"] = clone!["attivo"]
    
    this.infoLavoro.modifica = false;
  }

  ControllaUgualiLavoro(){
    const m = this.utenteModificato!;
    const vis = this.utenteVisualizzato!;

    if((this.utenteModificato.assuntoIl as any) instanceof Date){
      const data = (this.utenteModificato.assuntoIl as any);
      
      const anno = data.getFullYear() + "";
      const mese = data.getMonth() + 1 + "";
      const giorno = data.getDate() + "";

      this.utenteModificato.assuntoIl = `${anno}-${mese.padStart(2, "0")}-${giorno.padStart(2, "0")}`
    }

    this.infoLavoro.uguali = Object.entries(m).every(([k, v]) => v === vis[k as keyof Utente] || !["ruolo", "assuntoIl", "attivo"].includes(k));
    this.infoLavoro.valido = ["ruolo", "assuntoIl", "attivo"].every((k) => m[k as keyof Utente] != null && m[k as keyof Utente] != undefined);

    if(m.ruolo == "Admin" && m['2FA'] == false){
      this.notifiche.NuovaNotifica({
        "titolo": "Ruolo non valido",
        "descrizione": "Non puoi assegnare il ruolo di Admin ad un utente senza 2FA",
        "tipo": "errore"
      })

      setTimeout(() => m.ruolo = "Dipendente");
    }
  }

  
  ResettaInfoPersonali(){
    this.ResettaErrori();
    (document.activeElement as HTMLElement).blur()

    const clone = structuredClone(this.utenteVisualizzato);
    this.utenteModificato!["nome"] = clone!["nome"]
    this.utenteModificato!["cognome"] = clone!["cognome"]
    this.utenteModificato!["username"] = clone!["username"]
    this.utenteModificato!["email"] = clone!["email"]
    this.utenteModificato!["telefono"] = clone!["telefono"]
    this.utenteModificato!["2FA"] = clone!["2FA"]

    this.infoPersonali.modifica = false;  
  }

  ResettaErrori(){
    const chiavi = Object.keys(this.infoPersonali.errori) as any;

    chiavi.forEach((c: keyof typeof this.infoPersonali.errori) => this.infoPersonali.errori[c] = "")
  }


  async VerificaInputPersonali(e: Event){
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

        if(!(await this.utenti.UsernameEsistente(valore))){
          this.infoPersonali.errori["info-username"] = "Username già esistente"
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

            this.utenteModificato!['2FA'] = false;
        } 
      break;
      default:
        break;
    }
    this.ControllaErroriPersonali();
  }

  ControllaUgualiPersonali(){
    const m = this.utenteModificato!;
    const vis = this.utenteVisualizzato!;

    this.infoPersonali.uguali = Object.entries(m).every(([k, v]) => v === vis[k as keyof Utente] || !["nome", "cognome", "email" ,"telefono", "2FA", "username"].includes(k));
    console.log(this.infoPersonali)
  }

  ControllaErroriPersonali(){
    this.infoPersonali.valide = Object.values(this.infoPersonali.errori).every(e => !e);
    this.ControllaUgualiPersonali();
  }

  async AggiornaUtente(tipo: "lavoro" | "personale"){
    const utente = this.utenteModificato!;
    const info = tipo == "personale" ? this.infoPersonali : this.infoLavoro;
    
    info.caricamento = true;
    const res = await this.utenti.ModificaUtente(utente);
    info.caricamento = false;

    if(!res){
      info.modifica = false;

      this.notifiche.NuovaNotifica({
        titolo: "Operazione completata",
        descrizione: "Le modifiche sono state apportate con successo",
        tipo: "info"
      })

      this.onUtenteModificato.emit(utente);
    }
    else this.Errore(res);

  }

  Errore(status: number){
    
    switch(status){
      case 405:
        this.notifiche.NuovaNotifica({
          titolo: "Non hai i permessi necessari",
          descrizione: "Non puoi effettuare questa operazione",
          tipo: "errore"
        })
        return;
      default:
        this.notifiche.NuovaNotifica({
          titolo: "Qualcosa è andato storto",
          descrizione: "Non è stato possibile completare l'operazione richiesta",
          tipo: "errore"
        })
        return;
    }
  }

  ChiudiModale(){
    this.modale.nativeElement.classList.add("chiudi");
    setTimeout(() => {
      this.modale.nativeElement.close()
      this.modale.nativeElement.classList.remove("chiudi");
      this.onChiudi.emit();
    }, 301);
  }

  CaricaImmagine(e: File){
    this.caricamentoImmagine = true;

    this.utenti.CaricaImmagine(e, this.utenteVisualizzato.username)
    .then((res: any) => {
      if(isNaN(res)){
        this.caricamentoImmagine = false;
        this.notifiche.NuovaNotifica({
          titolo: "Operazione completata",
          descrizione: "L'immagine è stata caricata con successo",
          tipo: "info"
        })
        this.cambioImmagine = false;
        this.onImmagineCambiata.emit(res["url"]);
      }
      else this.Errore(res);
    })
  }

  async ResetImmagine(){
    const modale = this.modaleElimina.modale.nativeElement;
      
    this.inCaricamentoElimina = true;
    const status = await this.utenti.ResetImmagine(this.utenteVisualizzato.username);
    this.inCaricamentoElimina = false; 
    
    modale.classList.add("chiudi");
    setTimeout(() => {
      modale.close()
      modale.classList.remove("chiudi");
    }, 301);

    if(!status)
    {
      this.onImmagineCambiata.emit("");
    }
    else this.Errore(status);

    this.vuoleEliminare = false;
  }
}
