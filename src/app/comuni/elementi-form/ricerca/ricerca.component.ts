import { Component, ElementRef, EventEmitter, Input, Optional, Output, Self, ViewChild } from '@angular/core';
import { InputTextComponent } from '../input-text/input-text.component';
import { ControlValueAccessor, NgControl } from '@angular/forms';

export type Opzione = {
  testo: string,
  valore: any
}

export type Errore = {
  messaggio: string,
  codice: number
}

@Component({
  selector: 'Ricerca',
  templateUrl: './ricerca.component.html',
  styleUrls: ['./ricerca.component.scss'],
  imports: [InputTextComponent],
  standalone: true,
})
export class RicercaComponent implements ControlValueAccessor {
  @Input("testo-label")
  public testoLabel!: string;

  @Input("disabled")
  public disabled: boolean = false;

  @Input("icona")
  public icona?: string;

  @Input("id-input")
  public idInput: string | null = null;

  @Input("mockup")
  public mockup: boolean = false;

  @Input("name")
  public name?: string;

  @Input("valore")
  public value: string = "";

  @Input("messaggio-errore")
  public errore?: string;

  @Input("disabilitato")
  public disabilitato: boolean = false;

  @Input("opzioni")
  public opzioni!: Opzione[];

  @Input("caricamento")
  public caricamento: boolean = false;

  @Output()
  onSelezionato: EventEmitter<Opzione> = new EventEmitter<Opzione>();

  @Output()
  onInput: EventEmitter<Event> = new EventEmitter<Event>();

  @Output()
  onChange: EventEmitter<Event> = new EventEmitter<Event>();

  @Output()
  onKeyDown: EventEmitter<KeyboardEvent> = new EventEmitter<KeyboardEvent>();

  @ViewChild("inputText")
  input!: ElementRef<InputTextComponent>

  constructor(
    @Self()
    @Optional()
    private ngControl: NgControl,
    ref:ElementRef<HTMLElement>) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    ref.nativeElement.addEventListener("mousedown", (e) => {
      if(e.target === ref.nativeElement.querySelector("input"))return;
      e.preventDefault();
      e.stopPropagation();
      ref.nativeElement.querySelector("input")?.focus()
    })
  }

  writeValue(value: string): void {
    this.value = value ?? "";
    
    if(this.input && this.input.nativeElement && this.input.nativeElement.input){
      this.input.nativeElement.input.nativeElement.value = this.value;
    }
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  registerOnChange(fn: any): void {
    this.onValueChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public onValueChange(value?: string) {}
  public onTouched() {}

  public Input(e: Event){
    this.onInput.emit(e)
    const valore = (e.target as HTMLInputElement | null)?.value
    return this.onValueChange(valore)
  }

  public Cambiato(e: Event){
    this.onChange.emit(e)
  }

  Seleziona(opzione: Opzione){
    this.value = opzione.testo;
    (document.activeElement as HTMLElement)?.blur();
    this.onSelezionato.emit(opzione);
  }

}
