import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TransizioneService {

  private dimensioni : { [key: string]: string } = {}
  public ultimaRoute? : string;
  private main? : HTMLElement;

  private posizioniLogo : { [key: string]: [number, number] } = {}

  private wrapper: { [key: string]: HTMLElement } = {};

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
    return this.ultimaRoute ? this.posizioniLogo[this.ultimaRoute] : [null, null];
  }

  PosizioneLogo(c : HTMLElement, url : string ){
    const rect = c.getBoundingClientRect()
    this.posizioniLogo[url] = [rect.left, rect.top];
  }

  AperturaForm(formCambio : HTMLElement){
    if(this.main && this.ultimaRoute)
    {
      
      const maxWidth = this.widthPrecedente();
      if(!maxWidth)return;
      
      const widthIniziale = this.CalcolaWidthContenitore(formCambio);
      this.main.style.setProperty("--max-width", maxWidth)
      formCambio.style.setProperty("--max-width", maxWidth)
      this.main.classList.add("transizione");
      formCambio.classList.add("transizione");
      
      setTimeout(() => {
        this.main?.style.setProperty("--max-width", widthIniziale);
        formCambio.style.setProperty("--max-width", widthIniziale);
        setTimeout(() => {
          this.main?.classList.remove("transizione");
          formCambio.classList.remove("transizione");
        }, 500)
      }, 1);
    }
  }

  CalcolaWidthContenitore(el : HTMLElement){
    const padding = parseFloat(getComputedStyle(el).paddingLeft);
    const w = Array.from(el.children).map((m) => parseFloat(getComputedStyle(m).width))
    return Math.max(...w) + padding * 2 + "px";
  }

  SpostamentoLogo(logo : HTMLElement){

    const [xPrec, yPrec] = this.PosLogoPrecedente();
    if(!yPrec || !xPrec)return;

    const rect = logo.getBoundingClientRect();
    const [xAtt, yAtt] = [rect.left, rect.top];
    
    // const x = xAtt - xPrec;
    const y = yPrec - yAtt;

    // logo.style.setProperty("--x", `${x}px`)
    logo.style.setProperty("--y", `${y}px`)

    setTimeout(() => {
      logo.classList.add("transizione-x2");
      logo.style.setProperty("--y", "0")
      // logo.style.setProperty("--x", "0")
    }, 1);
  }

  NascondiWrapperTransizione(el : HTMLElement, route : string){
    el.classList.add("nascosto");
    this.wrapper[route] = el;
  }

  MostraProssimoWrapper(route : string){
    if(route in this.wrapper)
    {
      this.wrapper[route].classList.remove("nascosto")
    }
  }
}
