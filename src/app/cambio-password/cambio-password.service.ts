import { Injectable, OnInit } from '@angular/core';
import chroma from 'chroma-js';
import { ControllaToken } from '../utils/funzioni';
import { Router } from '@angular/router';
import { GestoreServerService } from '../server/gestore-server.service';
import { Metodi } from '../utils/TipiSpeciali';

type Parametro = {
  regola : string,
  controllo : (s : string) => boolean
}

@Injectable({
  providedIn: 'root'
})
export class CambioPasswordService {

  constructor(private server : GestoreServerService){}

  parametri : Parametro[] = [
    { regola : "Lettere maiuscole e minuscole", controllo : this.MaiuscoleMinuscole},
    { regola : "Almeno un numero", controllo : this.Numeri},
    { regola : "Essere lunga", controllo : this.Lunghezza},
    { regola : "Contenere simboli ($#\\)", controllo : this.Simboli}
  ]

  get percentuale(){
    return 100 / this.stati.length * this.stati.filter(s => s).length;
  }

  public stati : boolean[] = [];

  Controlla(s : string){
    this.stati = this.parametri.map((p) => p.controllo(s))
  }

  Cambia(password : string ){
    return this.server.InviaRichiesta(Metodi.POST, "/api/cambio-password", { password })
  }
  
  MaiuscoleMinuscole(s : string){
    return /[A-Z]/.test(s) && /[a-z]/.test(s);
  }

  Numeri(s : string){
    return /[0-9]/.test(s)
  }

  Lunghezza(s : string){
    return s.length >= 8
  }

  Simboli(s : string){
    return /\$|#|\\|!|"|£|%|&|\/|\(|\)|=|\?|\^|\|/.test(s)
  }

  Colore(){
    return this.getGradientColors("#a83232", "#39bd57")[this.stati.filter(s => s).length - 1];
  }

  getGradientColors(colore1 : string, colore2 : string, steps : number = 4) {
    const colorScale = chroma.scale([colore1, colore2]).mode('hsl');
    const c = colorScale.colors(steps);
    return [colore1, ...c.slice(1, -1), colore2]
  }
}
