import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { SincronizzazioneService } from '../../servizio.sincronizzazione';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'InputCodice',
  templateUrl: './input-codice.component.html',
  styleUrls: ['./input-codice.component.scss'],
  imports: [FormsModule],
  standalone: true
})
export class InputCodiceComponent{

  constructor(public sinc: SincronizzazioneService){}

  @Output()
  CodiceCambiato = new EventEmitter<boolean>()

  @ViewChild("n0")
  n0!: ElementRef<HTMLInputElement>

  @ViewChild("n1")
  n1!: ElementRef<HTMLInputElement>

  @ViewChild("n2")
  n2!: ElementRef<HTMLInputElement>

  @ViewChild("n3")
  n3!: ElementRef<HTMLInputElement>

  @ViewChild("n4")
  n4!: ElementRef<HTMLInputElement>

  @ViewChild("n5")
  n5!: ElementRef<HTMLInputElement>

  CodiceCambiatoEvent(){
    this.CodiceCambiato.emit(true)
  }

  private PrendiInput(indice: 0|1|2|3|4|5){
    switch(indice){
      case 0:
        return this.n0.nativeElement;
      case 1:
        return this.n1.nativeElement;
      case 2:
        return this.n2.nativeElement;
      case 3:
        return this.n3.nativeElement;
      case 4:
        return this.n4.nativeElement;
      case 5:
        return this.n5.nativeElement;
    }
  }

  CambiaInput(indice: 0|1|2|3|4|5){
    const attuale = this.PrendiInput(indice)
    
    if(attuale.value.length > 1){
      attuale.value = Array.from(attuale.value).at(-1)!;
    }

    if(!attuale.value || indice == 5)return;

    const prossimo = this.PrendiInput(++indice as any)
    
    console.log(attuale, prossimo)
    attuale.blur();
    prossimo.focus();
  }

  GestisciKey(e: KeyboardEvent, indice: 0|1|2|3|4|5){
    const attuale = this.PrendiInput(indice)
    
    if(e.key != "Backspace" || attuale.value || indice == 0) return;

    const precedente = this.PrendiInput(--indice as any)
    attuale.blur();
    precedente.focus();
  }
}
