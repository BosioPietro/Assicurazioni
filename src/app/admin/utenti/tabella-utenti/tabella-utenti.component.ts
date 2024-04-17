import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { UtenteComponent } from './utente/utente.component';
import { TabellaService } from '../tabella.service';
import { IonIcon } from '@ionic/angular/standalone';
import { UtentePlaceholderComponent } from './utente-placeholder/utente-placeholder.component';
import { NotificheService } from 'src/app/comuni/notifiche/notifiche.service';

@Component({
  selector: 'TabellaUtenti',
  templateUrl: './tabella-utenti.component.html',
  styleUrls: ['./tabella-utenti.component.scss'],
  imports: [CheckboxModule, UtenteComponent, IonIcon, UtentePlaceholderComponent],
  standalone: true
})
export class TabellaUtentiComponent implements OnInit{

  @ViewChild("header")
  header!: ElementRef<HTMLElement>;

  indici = [0, 0, 0, 0, 0]

  constructor(public tabella: TabellaService, public notifiche: NotificheService) { }

  async ngOnInit(): Promise<void> {
    const utenti = await this.tabella.PrendiUtenti().catch(() => ( {data: []} ));

    this.tabella.tutti = this.tabella.utenti = utenti["data"];

    if(this.tabella.utenti.length)return;
    this.notifiche.NuovaNotifica({
      titolo: "Qualcosa è andato storto",
      descrizione: "Non è stato possibile recuperare gli utenti dal server",
      tipo: "errore"
    })
  }

  Filtra(i: number, campo: string){
    const thHeader = Array.from(this.header.nativeElement.querySelectorAll(".th"));
    const icona = thHeader[i].querySelector("ion-icon")!;

    thHeader.forEach((th) => th.querySelector("ion-icon")!.name = "chevron-expand");
    
    this.indici[i] = (this.indici[i] + 1) % 2;
    icona.name = ["chevron-down", "chevron-up"][this.indici[i]];

    this.tabella.Ordina(this.indici[i] == 0, campo as any);
  }


}
