import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BottoniOpzioneComponent } from 'src/app/comuni/elementi-form/opzioni/opzioni.component';
import { BarraRicercaComponent } from 'src/app/comuni/elementi-form/barra-ricerca/barra-ricerca.component';
import { TabellaUtentiComponent } from './tabella-utenti/tabella-utenti.component';
import { TabellaService } from './tabella.service';
import { MenuModule } from 'primeng/menu';
import { animazione } from 'src/app/comuni/animazioni/appari-disappari';
import { MenuItem } from 'primeng/api';
import { NotificheService } from 'src/app/comuni/notifiche/notifiche.service';



@Component({
  selector: 'Utenti',
  templateUrl: './utenti.page.html',
  styleUrls: ['./utenti.page.scss'],
  animations: [animazione],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, BottoniOpzioneComponent, BarraRicercaComponent, TabellaUtentiComponent, MenuModule],
})
export class UtentiPage{

  @ViewChild("modale")
  modale!: ElementRef<HTMLDialogElement>;

  constructor(public tabella: TabellaService, private notifiche: NotificheService) { }

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
    this.modale.nativeElement.showModal();
  }

  ChiudiModale(){
    const modale = this.modale.nativeElement;

    modale.classList.add("chiudi");
    setTimeout(() => {
      modale.close()
      modale.classList.remove("chiudi");
    }, 301);
  }

  async EliminaUtenti(){
    this.ChiudiModale();
    
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

}
