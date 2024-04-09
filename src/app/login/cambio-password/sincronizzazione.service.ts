import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class SincronizzazioneService {

    public valori = {
      password: "",
      conferma: ""
    }

    public errori = {
      conferma: ""
    }

    public giorniMancanti?: number;
    public valido: boolean = false;

    public Aggiorna(e: Event, valido: boolean){
      const input = e.target as HTMLInputElement;
      if(!input) return;

      const nome = input["name"] as "password" | "conferma" ;
      this.valori[nome] = input.value;
      this.valido = valido;
    }
}