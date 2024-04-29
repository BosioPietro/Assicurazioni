import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Immagine } from '../perizia.model';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'Carosello',
  templateUrl: './carosello.component.html',
  styleUrls: ['./carosello.component.scss'],
  imports: [IonIcon],
  standalone: true
})
export class CaroselloComponent {

  @Input()
  immagini!: Immagine[];

  @Input()
  stileImmagine?: Record<string, any>;

  @Input("altezza-immagine")
  altezzaImmagine?: string;

  @Input("nascondi-tutte")
  nascondiTutte?: boolean;

  @Input("quadrate")
  quadrate?: boolean;

  @Input("disabilita-hover")
  disabilitaHover?: boolean;

  @Input("controlli-immagine")
  controlliImmagine?: boolean;

  @Input()
  disabilitato: boolean = false;

  @Output()
  onAggiungi = new EventEmitter<void>();

  @Output()
  onRimuovi = new EventEmitter<void>();

  @Output()
  onVisualizza = new EventEmitter<void>();

  @Output()
  onIndiceCambiato = new EventEmitter<boolean>();

  immagineTransizione?: Immagine;
  indice: number = 0;
  indicePrecedente: number = 0;
  inTransizione: boolean = false;
  noTransizione: boolean = false;
  grandezza?: number;
  tempoTransizione: number = 1000;

  PrendiStile(img: Immagine){
    return {'--img': 'url(' + img.url + ')',  ...this.stileImmagine};
  }

  Cambia(segno: boolean){
    if(this.inTransizione)return;
    
    this.immagineTransizione = this.immagini[this.indice];
    this.indicePrecedente = this.indice;
    this.indice = segno ? this.indice + 1 : this.indice - 1;
    
    if(this.indice == -2){
      this.indice = -1;
    }

    if(this.indice == 2){
      this.indice = 1;
    }

    if(segno)
    {
      this.Prossima();
    }
    else this.Precedente()
  }

  Precedente(){
    this.inTransizione = true;
    this.RiarrangiaImmagini();
    this.noTransizione = true;
    this.grandezza = 1;
    
    setTimeout(() => {
      this.noTransizione = false;
      this.grandezza = undefined; 
    }, 1);
    
    setTimeout(() => {
      this.indice = 0;
      this.inTransizione = false
      this.indicePrecedente = 0;
    }, this.tempoTransizione);
  }

  Prossima(){
    this.inTransizione = true;
    setTimeout(() => {
      this.noTransizione = true;
      this.RiarrangiaImmagini()
      this.indice = 0;
      this.immagineTransizione = undefined;
      
      setTimeout(() => {
        this.inTransizione = false
        this.indicePrecedente = 0;
        this.noTransizione = false
      }, 100);
    }, this.tempoTransizione);
  }

  RiarrangiaImmagini(){
    if(this.indicePrecedente < this.indice){
      this.immagini.push(this.immagini.shift()!);
    }else{
      this.immagini.unshift(this.immagini.pop()!);
    }
  }

}
