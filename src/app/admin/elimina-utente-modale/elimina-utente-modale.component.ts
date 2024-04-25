import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import Utente from '../utenti/tabella-utenti/utente.model';
import { IonIcon } from '@ionic/angular/standalone'
import { EliminaUtenteService } from './elimina-utente.service';

@Component({
  selector: 'EliminaUtenteModale',
  templateUrl: './elimina-utente-modale.component.html',
  styleUrls: ['./elimina-utente-modale.component.scss'],
  imports: [IonIcon],
  standalone: true,
})
export class EliminaUtenteModaleComponent  implements AfterViewInit {

  @Input()
  selezionati!: Utente[];

  @ViewChild("modaleElimina")
  modale!: ElementRef<HTMLDialogElement>;

  @Output()
  onChiudi = new EventEmitter<void>();

  @Output()
  onElimina = new EventEmitter<Utente[]>();

  @Output()
  onErrore = new EventEmitter<number>();

  constructor(private elimina: EliminaUtenteService) { }

  inCaricamento: boolean = false;

  ngAfterViewInit() {
    this.modale.nativeElement.showModal();
  }

  ChiudiModale(){
    this.modale.nativeElement.classList.add("chiudi");
    setTimeout(() => {
      this.modale.nativeElement.close()
      this.modale.nativeElement.classList.remove("chiudi");
      this.onChiudi.emit();
    }, 301);
  }

  async EliminaUtenti(){
    this.inCaricamento = true;
    const status = await this.elimina.ModificaUtente(this.selezionati);
    this.inCaricamento = false; 
    
    if(!status){
      this.onElimina.emit(this.selezionati);
      this.ChiudiModale();
    }
    else this.onErrore.emit(status);
  }

}
