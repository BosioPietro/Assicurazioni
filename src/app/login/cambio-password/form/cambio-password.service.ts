import { Injectable } from '@angular/core';
import { GestoreServerService } from 'src/app/server/gestore-server.service';
import { Metodi } from 'src/app/utils/TipiSpeciali';
import tinycolor from 'tinycolor2';

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
    return /\$|#|\\|!|"|£|%|&|\/|\(|\)|=|\?|\^|\||\@/.test(s)
  }

  Colore(){
    const n = this.stati.filter(s => s).length;

    if(this.ultimoInput && n)
    {
      return this.getGradientColors("#eb4034", "#39bd57", this.parametri.length)[n - 1];
    }
    else return "#000"
  }

  getGradientColors(color1: string, color2: string, steps: number) {
    const colors = [];
    const tinyColor1 = tinycolor(color1);
    const tinyColor2 = tinycolor(color2);
  
    colors.push(tinyColor1.toHexString());
    colors.push(tinyColor2.toHexString());
  
    for (let i = 1; i < steps - 1; i++) {
      const ratio = i / (steps - 1);
      const intermediateColor = tinycolor.mix(tinyColor2, tinyColor1, ratio).toHexString();
      colors.push(intermediateColor);
    }
  
    return colors;
  }

  VerificaRecupero(){
    return this.server.InviaRichiesta(Metodi.GET, "/api/verifica-recupero")
  }

  CambiaPassword(password: string){
    return this.server.InviaRichiesta(Metodi.POST, "/api/cambio-password", { password })
  }
}
