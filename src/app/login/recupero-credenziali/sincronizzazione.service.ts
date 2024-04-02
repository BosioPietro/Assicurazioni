import { Injectable } from '@angular/core';
import { TransizioneService } from '../servizio-transizione.service';

@Injectable({
  providedIn: 'root'
})
export class SincronizzazioneService {

    constructor(private transizione: TransizioneService){}

    public stato: number = 1;
    public mail: string = "";
    public codiceCorretto: boolean = false;
    public caratteriCodice = new Array(6).fill("");
    public staAnimando = false;
    public inTransizione = false;

    public formHtmlFinti: {[key:string] : HTMLElement} = {}
    public valori = {
      "mail-recupero" : ""
    }
    public formValido: boolean = false;

    public errori = {
      mail: "",
      codice: ""
    }
  

    Aggiorna(e: Event, valido: boolean){
      const input = e.target as HTMLInputElement;
      if(!input) return;

      this.valori["mail-recupero"] = input.value;
      this.formValido = valido;
    }

    TransizioneForm(form: HTMLElement){
    
      const padding = parseFloat(getComputedStyle(form).paddingInline) * 2
      const formFinto =  this.formHtmlFinti["codice"];

      formFinto.style.display = "flex";
      formFinto.classList.add("invisibile")

      const wIniziale = getComputedStyle(form).width
      const wFinale = padding + formFinto.clientWidth + "px"

      const formInterno = form.querySelector("form")!  
      const hIniziale = formInterno.clientHeight + "px";
      const hFinale = formFinto.clientHeight + "px";

      this.CambiaHeightForm(hIniziale, hFinale, formInterno);
      
      formFinto.style.display = "";
      formFinto.classList.remove("invisibile")

      this.transizione.CambiaWidthForm(wIniziale, wFinale, form);
      this.transizione.NascondiFigli(form)  

      this.staAnimando = true;
      this.inTransizione = true;

      // lasciamo perdere
      setTimeout(() => {
        this.transizione.MostraFigli(form, false)
        ++this.stato;
        setTimeout(() => {
          this.staAnimando = false;
          setTimeout(() => {
            formInterno.style.setProperty("--height", "auto")
            formInterno.classList.remove("transizione")
            this.inTransizione = false;
          }, 500);
        }, 1);
      }, 500);
    
    }

    CambiaHeightForm(iniziale: string, finale: string, form: HTMLElement){
      form.style.setProperty("--height", iniziale)
      form.classList.add("transizione")
      
      setTimeout(() => {
        form.style.setProperty("--height", finale)
      }, 1);
    }

    WidthForm(form:HTMLElement){
      const w = parseFloat(getComputedStyle(form).width);
      const padding = parseFloat(getComputedStyle(form).paddingInline);

      return w + padding * 2 + "px";
    }
}
