import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TransizioneService {

  public formFinti : {[key : string] : HTMLElement} = {};
  public formVeri : {[key : string] : HTMLElement} = {};
  
  public main?: HTMLElement;
  public overlay?: HTMLElement;

  public inTransizione:boolean = false;
  public ultimaRoute?: string;
  public routeAttuale?: string;

  AggiungiForm(form : HTMLElement, route : string){
    this.formFinti[route] = form;
  }

  private CalcolaWidth(route : string){
    const form = this.formFinti[route];

    const w = Array.from(form.children).map((c) => parseFloat(getComputedStyle(c).width))
    const padding = parseFloat(getComputedStyle(form).paddingInline);

    return Math.max(...w) + padding * 2 + "px";
  }

  TransizioneUscita(form : HTMLElement, route : string){

    if(!this.main) return;
    this.inTransizione =  true;

    const wIniziale = getComputedStyle(form).width;
    const w = this.CalcolaWidth(route);

    this.CambiaWidthForm(wIniziale, w, form)
    
  }

  CambiaWidthForm(iniziale: string, finale: string, form: HTMLElement){
    if(!this.main) return;
    this.main.style.setProperty("--max-width", iniziale)
    form.style.setProperty("--max-width", iniziale)

    this.main.classList.add("transizione")
    form.classList.add("transizione")
    
    setTimeout(() => {
      form.style.setProperty("--max-width", finale)
      this.main?.style.setProperty("--max-width", finale)
    }, 1);
  }

  MostraOverlay(){
    if(!this.overlay || !this.ultimaRoute || !this.routeAttuale) return;

    const formPrec = this.formFinti[this.ultimaRoute]
    const formAtt = this.formVeri[this.routeAttuale]

    formPrec.classList.add("mostra")
    this.overlay.classList.add("visibile")
    if(!this.ControllaLogo(formAtt)){
      setTimeout(() => {
        this.MostraOverlay();
      }, 1)
      return;
    }
    
    this.MuoviLogo(formPrec, formAtt);
    this.NascondiFigli(formPrec);
    this.NascondiFigli(formAtt, false)

    setTimeout(() => {
      this.overlay?.classList.remove("visibile")
      
      this.MostraFigli(formAtt)
      this.ResettaForm(formPrec) 
      this.inTransizione = false;

      setTimeout(() => {
        formAtt.querySelectorAll("*").forEach((c) => c.classList.remove("transizione"))
      }, 500);
    }, 500);
  }

  ResettaForm(form : HTMLElement){
    form.classList.remove("mostra")

    this.MostraFigli(form, false)
    
    Object.values(this.formVeri).forEach((f) => {
      f.style.setProperty("--max-width", null)
    })

    const logo = form.querySelector(".logo") as HTMLElement
    if(!logo)return;
    logo.style.setProperty("--y", "0")
  }

  NascondiFigli(form :  HTMLElement, transizione = true){
    const f = Array.from(form.querySelectorAll(":not(.logo)")).map((c) => c as HTMLElement)

    if(transizione)
    {
      f.forEach((c) => c.classList.add("transizione"))
    }
    else f.forEach((c) => c.classList.remove("transizione"))
    f.forEach((c) => c.classList.add("nascosto"))
  }

  MostraFigli(form :  HTMLElement, transizione = true){
    const f = Array.from(form.querySelectorAll(":not(.logo)")).map((c) => c as HTMLElement)

    if(transizione){
      f.forEach((c) => c.classList.add("transizione"))
    }
    else f.forEach((c) => c.classList.remove("transizione"))
    f.forEach((c) => c.classList.remove("nascosto"))
  }

  MuoviLogo(prec: HTMLElement, att: HTMLElement){
    const logoPrec = prec.querySelector(".logo")! as HTMLElement
    const logoAtt = att.querySelector(".logo")! as HTMLElement

    const [xPrec, yPrec] = this.CalcolaCoordinate(logoPrec)
    const [xAtt, yAtt] = this.CalcolaCoordinate(logoAtt)

    const yDiff = yAtt - yPrec;

    logoPrec.style.setProperty("--y", `${yDiff}px`)
    logoPrec.classList.add("transizione")
  }

  ControllaLogo(f : HTMLElement){
    return !!f.querySelector(".logo")?.getBoundingClientRect().top
  }

  CalcolaCoordinate(logo: HTMLElement){
    const r = logo.getBoundingClientRect()
    return [r.left, r.top]
  }

  NascondiOverlay(){
    if(!this.overlay || !this.ultimaRoute) return;

    const form = this.formFinti[this.ultimaRoute]
    form.classList.remove("mostra")
    this.overlay.classList.remove("visibile")
  }

}
