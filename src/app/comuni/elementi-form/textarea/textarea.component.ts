import { Component, ElementRef, EventEmitter, Input, OnInit, Optional, Output, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'ComponenteTextarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  standalone: true
})
export class TextareaComponent implements ControlValueAccessor{

  @Input("id-input")
  public idInput: string | null = null;

  @Input("name")
  public name?: string;

  @Output()
  onInput: EventEmitter<Event> = new EventEmitter<Event>();

  @Output()
  onChange: EventEmitter<Event> = new EventEmitter<Event>();

  @ViewChild("textarea")
  textarea!: ElementRef<HTMLTextAreaElement>;

  @Input()
  value: string = "";
  
  constructor(
  @Self()
  @Optional()
  private ngControl: NgControl, ref:ElementRef<HTMLElement>) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  writeValue(value: string): void {
    this.value = value ?? "";
    
    this.textarea.nativeElement.value = this.value;
  }

  setDisabledState(isDisabled: boolean): void {
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
