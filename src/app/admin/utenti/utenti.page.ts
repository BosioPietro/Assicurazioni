import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BottoniOpzioneComponent } from 'src/app/comuni/elementi-form/opzioni/opzioni.component';
import { BarraRicercaComponent } from 'src/app/comuni/elementi-form/barra-ricerca/barra-ricerca.component';
import { TabellaUtentiComponent } from './tabella-utenti/tabella-utenti.component';
import { TabellaService } from './tabella.service';
import { MenuModule } from 'primeng/menu';
import { animazione } from 'src/app/comuni/animazioni/appari-disappari';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


@Component({
  selector: 'Utenti',
  templateUrl: './utenti.page.html',
  styleUrls: ['./utenti.page.scss'],
  animations: [animazione],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, BottoniOpzioneComponent, BarraRicercaComponent, TabellaUtentiComponent, MenuModule, ConfirmDialogModule],
})
export class UtentiPage {

  constructor(public tabella: TabellaService) { }

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

}
