import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Optional, Output, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'InputPassword',
  templateUrl: './input-password.component.html',
  styleUrls: ['../stile-input.scss','./input-password.component.scss'],
  imports: [IonIcon],
  standalone: true
})
export class InputPasswordComponent implements ControlValueAccessor, AfterViewInit {
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
  public value?: string;

  @Input("messaggio-errore")
  public errore?: string;

  @Input("disabilitato")
  public disabilitato: boolean = false;

  @Output()
  onInput: EventEmitter<Event> = new EventEmitter<Event>();

  @Output()
  public focusIn: EventEmitter<null> = new EventEmitter();

  @Output()
  public focusOut: EventEmitter<null> = new EventEmitter();

  @Output()
  onChange: EventEmitter<Event> = new EventEmitter<Event>();

  public passwordVisibile: boolean = false;

  public cont: HTMLElement;
  public input?: HTMLElement;
  

  constructor(
    @Self()
    @Optional()
    private ngControl: NgControl, ref:ElementRef<HTMLElement>) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    this.cont = ref.nativeElement;

    ref.nativeElement.addEventListener("mousedown", (e) => {
      if(e.target === ref.nativeElement.querySelector("input"))return;
      e.preventDefault();
      e.stopPropagation();
      ref.nativeElement.querySelector("input")?.focus()
    })
  }

  ngAfterViewInit(): void {
    this.input = this.cont.querySelector("input")!
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
    this.onInput.emit(e);
    return this.onValueChange((e.target as HTMLInputElement | null)?.value)
  }

  public Cambiato(e: Event){
    this.onChange.emit(e)
  }
  
}
