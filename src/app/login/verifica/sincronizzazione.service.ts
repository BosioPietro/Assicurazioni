import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class SincronizzazioneService {

    public errori = {
      codice: ""
    }

    public valori = {
      codice: ""
    }

    public giorniMancanti?: number;
    public codiceCorretto: boolean = false;

    public Aggiorna(valido: boolean){
      this.codiceCorretto = valido;
    }
}