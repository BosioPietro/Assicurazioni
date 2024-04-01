import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class SincronizzazioneService {

    public valori = {
      username: "",
      password: ""
    }

    public valido: boolean = false;

    public Aggiorna(e: Event, valido: boolean){
      const input = e.target as HTMLInputElement;
      if(!input) return;

      const nome = input["name"] as "username" | "password" ;
      this.valori[nome] = input.value;
      this.valido = valido;
    }
}