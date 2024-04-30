import { Component, ElementRef, HostListener, Input, OnInit, Optional, Self, ViewChild } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import Opzione from './opzione.model';
import { NgControl } from '@angular/forms';

@Component({
  selector: 'DropdownMultiplo',
  templateUrl: './dropdown-multiplo.component.html',
  styleUrls: ['./dropdown-multiplo.component.scss'],
  imports: [IonIcon],
  standalone: true,
})
export class DropdownMultiploComponent{
  @Input("testo-label")
  public testoLabel!: string;

  @Input("disabled")
  public disabled: boolean = false;

  @Input("icona")
  public icona?: string;

  @Input("id-input")
  public idInput: string | null = null;

  @Input("opzioni")
  public opzioni!: Opzione[];

  @Input("mockup")
  public mockup: boolean = false;

  @Input("disabilitato")
  public disabilitato: boolean = false;

  @Input("puo-deselezionare")
  puoDeselezionare: boolean = true;

  @ViewChild("contopzioni")
  contOpzioni!: ElementRef<HTMLElement>;

  public opzioniSelezionate: Opzione[] = [];
  public aperto: boolean = false;
  public sopra: boolean = false;
  public value: Opzione[] = [];

  constructor(
    @Self()
    @Optional()
    private ngControl: NgControl, private select:ElementRef) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }
  /**
   * Write form value to the DOM element (model => view)
   */
  writeValue(value: Opzione[]): void {
    if(value == undefined || value == null) return;
    
    // console.log(this.opzioni)
    this.opzioniSelezionate = this.opzioni.filter((o) => value.map((v) => v.valore).includes(o.valore) || value.some((v) => v["valore"].toLowerCase().startsWith("tutt")))
    this.value = this.opzioniSelezionate;
    // console.log(this.value)

    
    const opzioni = Array.from(this.contOpzioni.nativeElement.children);

    opzioni.filter((op) => {
      const input = op.querySelector("input")!;
      if(value.map((v) => v.valore).includes(input.value) || value.some((v) => v["valore"].toLowerCase().startsWith("tutt"))){
        op.classList.add("selezionata");
        return true;
      }
      return false;
    }).forEach((c) => c.classList.add("selezionata"));

    // console.log(this.value)
    this.onValueChange(this.value);
  }

  /**
   * Write form disabled state to the DOM element (model => view)
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Update form when DOM element value changes (view => model)
   */
  registerOnChange(fn: any): void {
    // Store the provided function as an internal method.
    this.onValueChange = fn;
  }

  /**
   * Update form when DOM element is blurred (view => model)
   */
  registerOnTouched(fn: any): void {
    // Store the provided function as an internal method.
    this.onTouched = fn;
  }

  public onValueChange(value?: Opzione[]) {}
  private onTouched() {}


  @HostListener('document:click', ['$event'])
  ClickFuori(event: MouseEvent) {
    if (!this.select.nativeElement.contains(event.target)) {
      this.aperto = false;
      setTimeout(() => this.sopra = false, 300);
    }
  }

  Toggle(){
    this.aperto = !this.aperto;
    if(!this.aperto){
      setTimeout(() => this.sopra = false, 300);
    }
    else this.sopra = true;
  }

  Seleziona(e: Event){
    const opzione = e.currentTarget as HTMLElement;
    const input = opzione.querySelector("input")!

    if(opzione.classList.contains("selezionata") && this.puoDeselezionare)
    {
      opzione.classList.remove("selezionata")
      this.opzioniSelezionate = this.opzioniSelezionate.filter((o) => o.valore != input.value);
      
      if(input.value.toLowerCase().startsWith("tutt")){
        this.opzioniSelezionate = [];
      }
      else if(this.opzioniSelezionate.some((o) => o.valore.toLowerCase().startsWith("tutt"))){
        this.opzioniSelezionate = this.opzioniSelezionate.filter((o) => !o.valore.toLowerCase().startsWith("tutt"));
      }

      return;
    }
    else{
      opzione.classList.add("selezionata") 
      this.opzioniSelezionate = [...this.opzioniSelezionate, this.opzioni.find((o) => o.valore == input.value)!];

      if(input.value.toLowerCase().startsWith("tutt")){
        this.opzioniSelezionate = this.opzioni;
      }
      else if(this.opzioniSelezionate.some((o) => o.valore.toLowerCase().startsWith("tutt"))){
        this.opzioniSelezionate = this.opzioni.filter((o) => o.valore.toLowerCase().startsWith("tutt"));
      }
    }
    
    this.value = this.opzioniSelezionate;

    this.onValueChange(this.value);
  }

  Testo(){
    const l = this.opzioniSelezionate.length;

    if(l == 0) return "Seleziona un utente";
    if(l == 1) return this.opzioniSelezionate[0].testo;
    if(l == this.opzioni.length) return "Tutti";
    return `${l} utenti selezionati`;
  }

  IsSelezionata(opzione: Opzione){
    return this.opzioniSelezionate.some((o) => o.valore == opzione.valore);
  }
}
