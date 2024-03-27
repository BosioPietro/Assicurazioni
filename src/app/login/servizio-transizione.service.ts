import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TransizioneService {

  private dimensioni : any = {}
  private ultimaRoute? : string;
  private main? : HTMLElement;

  private posizioniLogo : any = {}

  PrendiMain(m : HTMLElement){
    this.main = m;
  }

  CalcolaWidth(el : Element, route : string){
    const width = getComputedStyle(el).width

    this.ultimaRoute = route;
    this.dimensioni[route] = width;
  }

  private widthPrecedente(){
    return this.ultimaRoute ? this.dimensioni[this.ultimaRoute] : null;
  }

  private PosLogoPrecedente(){
    return this.ultimaRoute ? this.posizioniLogo[this.ultimaRoute] : null;
  }

  PosizioneLogo(c : HTMLElement, url : string ){
    const rect = c.getBoundingClientRect()
    this.posizioniLogo[url] = [rect.left, rect.top];
  }

  AperturaFormCambio(formCambio : HTMLElement){
    if(this.main && this.ultimaRoute)
    {
      const maxWidth = this.widthPrecedente();
      const widthIniziale = getComputedStyle(formCambio).width;

      this.main.style.setProperty("--max-width", maxWidth)
      formCambio.style.setProperty("--max-width", maxWidth)
      this.main.classList.add("transizione");
      formCambio.classList.add("transizione");
      
      setTimeout(() => {
        this.main?.style.setProperty("--max-width", widthIniziale);
        formCambio.style.setProperty("--max-width", widthIniziale);
      }, 1);
    }
  }

  SpostamentoLogo(logo : HTMLElement){
    const rect = logo.getBoundingClientRect();
    const [xAtt, yAtt] = [rect.left, rect.top];
    const [xPrec, yPrec] = this.PosLogoPrecedente();

    // const x = xAtt - xPrec;
    const y = yPrec - yAtt;

    // logo.style.setProperty("--x", `${x}px`)
    logo.style.setProperty("--y", `${y}px`)

    logo.classList.add("transizione-x2");
    setTimeout(() => logo.style.setProperty("--y", "0"), 1);
  }
}
