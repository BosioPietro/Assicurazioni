import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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



@Component({
  selector: 'Utenti',
  templateUrl: './utenti.page.html',
  styleUrls: ['./utenti.page.scss'],
  animations: [animazione],
  imports: [IonicModule, CommonModule, FormsModule, BottoniOpzioneComponent, BarraRicercaComponent, TabellaUtentiComponent, MenuModule, ImmagineProfiloDefault, InputTextComponent, DropdownComponent, ReactiveFormsModule],
  standalone: true,
})
export class UtentiPage{

  @ViewChild("modaleElimina")
  modaleElimina!: ElementRef<HTMLDialogElement>;

  @ViewChild("modaleUtente")
  modaleUtente!: ElementRef<HTMLDialogElement>;

  constructor(public tabella: TabellaService, private notifiche: NotificheService) { }

  opzioniSiNo: Opzione[] = [
    { testo: "Sì", valore: "true" },
    { testo: "No", valore: "false" }
  ]

  opzioniRuolo: Opzione[] = [
    { testo: "Dipendente", valore: "dipendente"},
    { testo: "Admin", valore: "admin"}
  ]

  formInfoPersonali: FormGroup = new FormGroup({
    'nome' : new FormControl('', [Validators.required]),
    'cognome' : new FormControl('', [Validators.required]),
    'username' : new FormControl('', [Validators.pattern(RegexInput["username"])]),
    'telefono' : new FormControl('', [Validators.pattern(RegexInput["telefono"])]),
    'email' : new FormControl('', [Validators.pattern(RegexInput["mail"])]),
    '2FA' : new FormControl('')
  })

  formInfoLavoro: FormGroup = new FormGroup({
    'ruolo': new FormControl('', Validators.required),
    'attivo': new FormControl('', Validators.required),
    'assuntoIl': new FormControl('', Validators.required),
  })

  modificaInfoPersonali: boolean = false;
  modificaInfoLavoro: boolean = false;

  CambiaMod(s: string){
    this.tabella.tipo = s;
  }

  opzioniDipendenti = [
    {nome: "Tutti", val: "Tutti"}, 
    {nome: "Admin", val: "Admin"},
    {nome: "Dipendenti", val: "Dipendente"}
  ]

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
    
    if(!(await this.tabella.EliminaUtenti()))
    {
      this.notifiche.NuovaNotifica({
        titolo: "Qualcosa è andato storto",
        descrizione: "Non è stato effettuare l'operazione richiesta",
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
    this.tabella.utenteModificato = this.tabella.utenteVisualizzato;

    this.formInfoPersonali.controls["nome"].setValue(this.tabella.utenteVisualizzato?.nome)
    this.formInfoPersonali.controls["cognome"].setValue(this.tabella.utenteVisualizzato?.cognome)
    this.formInfoPersonali.controls["username"].setValue(this.tabella.utenteVisualizzato?.username)
    this.formInfoPersonali.controls["email"].setValue(this.tabella.utenteVisualizzato?.email)
    this.formInfoPersonali.controls["telefono"].setValue(this.tabella.utenteVisualizzato?.telefono)
    this.formInfoPersonali.controls["2FA"].setValue(this.tabella.utenteVisualizzato!["2FA"])

    this.formInfoLavoro.controls["ruolo"].setValue(this.tabella.utenteVisualizzato?.ruolo)
    this.formInfoLavoro.controls["attivo"].setValue(this.tabella.utenteVisualizzato?.stato == "Attivo")
    this.formInfoLavoro.controls["assuntoIl"].setValue(this.tabella.utenteVisualizzato?.assuntoIl)

    setTimeout(() => this.modaleUtente.nativeElement.showModal());
  }

  ResettaInfoPersonali(){
    this.formInfoPersonali.controls["nome"].setValue(this.tabella.utenteVisualizzato?.nome)
    this.formInfoPersonali.controls["cognome"].setValue(this.tabella.utenteVisualizzato?.cognome)
    this.formInfoPersonali.controls["username"].setValue(this.tabella.utenteVisualizzato?.username)
    this.formInfoPersonali.controls["email"].setValue(this.tabella.utenteVisualizzato?.email)
    this.formInfoPersonali.controls["telefono"].setValue(this.tabella.utenteVisualizzato?.telefono)
    this.formInfoPersonali.controls["2FA"].setValue(this.tabella.utenteVisualizzato!["2FA"])

    this.modificaInfoPersonali = false;
  }
}
