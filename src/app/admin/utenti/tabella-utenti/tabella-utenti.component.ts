import { Component, ElementRef, ViewChild } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { UtenteComponent } from './utente/utente.component';
import { TabellaService } from '../tabella.service';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'TabellaUtenti',
  templateUrl: './tabella-utenti.component.html',
  styleUrls: ['./tabella-utenti.component.scss'],
  imports: [CheckboxModule, UtenteComponent, IonIcon],
  standalone: true
})
export class TabellaUtentiComponent  {

  @ViewChild("header")
  header!: ElementRef<HTMLElement>;

  constructor(public tabella: TabellaService) { }

  indici = [0, 0, 0, 0, 0]

  Filtra(i: number, campo: string){
    const thHeader = Array.from(this.header.nativeElement.querySelectorAll(".th"));
    const icona = thHeader[i].querySelector("ion-icon")!;

    thHeader.forEach((th) => th.querySelector("ion-icon")!.name = "chevron-expand");
    
    this.indici[i] = (this.indici[i] + 1) % 2;
    icona.name = ["chevron-down", "chevron-up"][this.indici[i]];

    this.tabella.Ordina(this.indici[i] == 0, campo as any);
  }


}
