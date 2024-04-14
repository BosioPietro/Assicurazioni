import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { SincronizzazioneService } from '../../../login/recupero-credenziali/sincronizzazione.service';
import { FormsModule } from '@angular/forms';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'InputCodice',
  templateUrl: './input-codice.component.html',
  styleUrls: ['./input-codice.component.scss'],
  imports: [FormsModule, IonIcon],
  standalone: true
})
export class InputCodiceComponent{

  constructor(public sinc: SincronizzazioneService){}

  @Input("messaggio-errore")
  errore?: string;

  @Input("mockup")
  mockup: boolean = false;

  @Output()
  CodiceCambiato = new EventEmitter<[boolean, string]>()

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

  ControllaCarattere(c: string){
    const alfa = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const caratteri = alfa + alfa.toLowerCase() + "0123456789";

    return caratteri.includes(c)
  }

  CambiaInput(indice: 0|1|2|3|4|5){
    const attuale = this.PrendiInput(indice)
    
    if(attuale.value.length > 1){
      attuale.value = attuale.value.slice(-1);
    }
    
    attuale.value = attuale.value.toUpperCase();
    this.ControllaValore();
    
    if(!this.ControllaCarattere(attuale.value)){
      attuale.value = "";
      return;
    }

    if(!attuale.value || indice == 5)return;

    const prossimo = this.PrendiInput(++indice as any)
    
    attuale.blur();
    prossimo.focus();
    this.ControllaValore();
  }

  ControllaValore(){
    let codice = ""
    for(let i = 0; i < 6; ++i){
      const input = this.PrendiInput(i as any)
      codice += input.value;
    }

    this.CodiceCambiato.emit([codice.length == 6, codice])
  }

  GestisciKey(e: KeyboardEvent, indice: 0|1|2|3|4|5){
    const attuale = this.PrendiInput(indice)
    
    if(e.key != "Backspace" || attuale.value || indice == 0) return;

    const precedente = this.PrendiInput(--indice as any)
    attuale.blur();
    precedente.focus();
  }

  Incolla(e: ClipboardEvent, indice: number){
    const clip = e.clipboardData || (window as any).clipboardData;
    e.preventDefault();
    if(!clip) return;

    const testo: string = clip.getData('text/plain').toString().trim()
    let ultimoInput;


    for(let i = indice; i < Math.min(testo.length, 6 - indice); ++i)
    {
      const input = this.PrendiInput(i as any)
      input.value = testo[i].toUpperCase();
      input.blur()
      ultimoInput = input;

      if(!this.ControllaCarattere(testo.charAt(i))){
        input.focus()
        input.value = ""
        this.ControllaValore();
        return;
      }
    }
    
    this.ControllaValore();
    if(testo.length < 6 - indice){
      const input = this.PrendiInput(testo.length as any)
      input.focus();
    }
    else ultimoInput?.focus();
  }
}
