import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'Calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss'],
  standalone: true
})
export class CalendarioComponent  implements OnInit {

  

  indiceMese = new Date().getMonth();
  mesi = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
          "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];

  ngOnInit() {}

  ultimiGiorniMesePrecedente: number[];
  giorniMeseCorrente: number[];
  giorniMeseSuccessivo: number[];

  constructor() {
    this.giorniMeseCorrente = this.GiorniMese(this.indiceMese);
    this.ultimiGiorniMesePrecedente = this.GiorniMesePrec(this.indiceMese);
    this.giorniMeseSuccessivo = this.GiorniRimasti();
  }

  GiorniMese(indice: number) {
    if(indice < 0 ){
      indice = -indice;
    }

    const giorni = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
    if (indice === 1) {
      const anno = new Date().getFullYear();
      if ((anno % 4 === 0 && anno % 100 !== 0) || anno % 400 === 0) {
        giorni[1] = 29;
      }
    }
  
    return new Array(giorni[indice]).fill('').map((_, i) => i + 1);
  }

  GiorniMesePrec(indice: number) {
    const giorniPrec = this.GiorniMese(indice - 1);
    const giornoSettimina = new Date(new Date().getFullYear(), indice, 1).getDay();

    if (giornoSettimina === 0) {
      return [];
    }

    return giorniPrec.slice(-giornoSettimina);
  }

  GiorniRimasti() {
    return new Array((7 * 5) - this.giorniMeseCorrente.length - this.ultimiGiorniMesePrecedente.length).fill("").map((_, i) => i + 1); 
  }
  

}
