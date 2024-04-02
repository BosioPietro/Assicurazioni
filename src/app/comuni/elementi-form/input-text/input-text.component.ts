import { Component, ElementRef, EventEmitter, Input, Optional, Output, Self, input } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'InputText',
  templateUrl: './input-text.component.html',
  styleUrls: ['../stile-input.scss', './input-text.component.scss'],
  imports: [IonIcon],
  standalone: true
})
export class InputTextComponent implements ControlValueAccessor {
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

  @Output()
  onInput: EventEmitter<Event> = new EventEmitter<Event>();

  @Output()
  onChange: EventEmitter<Event> = new EventEmitter<Event>();

  constructor(
    @Self()
    @Optional()
    private ngControl: NgControl, ref:ElementRef<HTMLElement>) {
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

  // Roba per far funzionare i ReactiveForm
  writeValue(value: string): void {
    this.value = value;
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
    return this.onValueChange((e.target as HTMLInputElement | null)?.value)
  }

  public Cambiato(e: Event){
    this.onChange.emit(e)
  }
  
}
