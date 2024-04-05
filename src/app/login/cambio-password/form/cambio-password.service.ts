import { Injectable, OnInit } from '@angular/core';
import chroma from 'chroma-js';
import { GestoreServerService } from 'src/app/server/gestore-server.service';
import { Metodi } from 'src/app/utils/TipiSpeciali';

type Parametro = {
  regola : string,
  controllo : (s : string) => boolean,
  nascosto? : boolean
}

@Injectable({
  providedIn: 'root'
})
export class CambioPasswordService{
  constructor(private server : GestoreServerService){}

  valido: boolean = false;

  parametri : Parametro[] = [
    { regola : "Iniziale", controllo: (s) => !!s.length, nascosto: true},
    { regola : "Lettere maiuscole e minuscole", controllo : this.MaiuscoleMinuscole},
    { regola : "Almeno un numero", controllo : this.Numeri},
    { regola : "Essere lunga", controllo : this.Lunghezza},
    { regola : "Contenere simboli ($#\\)", controllo : this.Simboli}
  ]

  ultimoInput : string = ""

  messaggi : string[] = [
    "Password Debole",
    "Password Banale",
    "Password Semplice",
    "Password Mediocre",
    "Password Buona",
    "Ottima Password!"
  ]

  get percentuale(){
    return 100 / this.stati.length * this.stati.filter(s => s).length;
  }

  get messaggio(){
    const n = this.stati.filter(s => s).length;

    return this.ultimoInput ? this.messaggi[n] : "Inserire Password";
  }

  public stati : boolean[] = [];

  ControllaValido(){
    this.valido = this.stati.every((s) => s)
  }

  Controlla(s : string){
    this.ultimoInput = s;
    this.stati = this.parametri.map((p) => p.controllo(s))
    this.ControllaValido();
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
    const n = this.stati.filter(s => s).length;

    if(this.ultimoInput && n)
    {
      return this.getGradientColors("#eb4034", "#39bd57", this.parametri.length)[n - 1];
    }
    else return "#000"
  }

  getGradientColors(colore1 : string, colore2 : string, steps : number) {
    const colorScale = chroma.scale([colore1, colore2]).mode('hsl');
    const c = colorScale.colors(steps);
    return [colore1, ...c.slice(1, -1), colore2]
  }

  VerificaRecupero(){
    return this.server.InviaRichiesta(Metodi.GET, "/api/verifica-recupero")
  }

  CambiaPassword(password: string){
    return this.server.InviaRichiesta(Metodi.POST, "/api/cambio-password", { password })
  }
}
