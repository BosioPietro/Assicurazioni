import { Component, ElementRef, HostListener, Input, OnInit, Optional, Self } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import Opzione from './opzione.model';
import { NgControl } from '@angular/forms';

@Component({
  selector: 'Dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  imports: [IonIcon],
  standalone: true,
})
export class DropdownComponent{
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
  puoDeselezionare: boolean = false;

  public opzioneSelezionata?: Opzione;
  public aperto: boolean = false;
  public sopra: boolean = false;
  public value: any;

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
  writeValue(value: any): void {
    if(value == undefined || value == null) return;
  
    this.opzioneSelezionata = this.opzioni.find((o) => o.valore == value.toString())
    this.value = this.opzioneSelezionata?.valore;
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

  public onValueChange(value?: string) {}
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
    const opzione = e.target as HTMLElement;
    const input = opzione.querySelector("input")!

    if(opzione.classList.contains("selezionata") && this.puoDeselezionare)
    {
      opzione.classList.remove("selezionata")
      this.opzioneSelezionata = undefined;
      this.value = undefined;
      return;
    }
    else opzione.classList.add("selezionata") 
    
    this.opzioneSelezionata = this.opzioni.find((o) => o.valore == input.value);
    this.value = this.opzioneSelezionata?.valore;

    this.onValueChange(this.value);
  }
}
