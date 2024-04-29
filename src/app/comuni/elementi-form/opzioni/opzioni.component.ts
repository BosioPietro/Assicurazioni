import { AfterContentInit, AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { RemInPx } from 'src/app/utils/funzioni';

@Component({
  selector: 'BottoniOpzione',
  templateUrl: './opzioni.component.html',
  styleUrls: ['./opzioni.component.scss'],
  standalone: true,
})
export class BottoniOpzioneComponent implements AfterViewInit{

  @Input("opzioni")
  opzioni!: {nome: string, val: string}[];

  @Output()
  onChange = new EventEmitter<string>();

  @ViewChild("cont")
  cont!: ElementRef<HTMLElement>

  @ViewChild("cella")
  cella!: ElementRef<HTMLElement>

  ngAfterViewInit(){
    (this.cont.nativeElement.querySelector(".overlay button") as HTMLButtonElement).click();
  }

  CambiaValore(val: string, e: Event){
    this.onChange.emit(val);

    const padding = getComputedStyle(this.cont.nativeElement).getPropertyValue("--spazio");
    const bottone = e.target as HTMLElement;

    const offset = this.CalcolaOffset(bottone, RemInPx(`${parseFloat(padding)}`));

    this.cella.nativeElement.style.left = offset + "px";
    this.cella.nativeElement.style.width = bottone.clientWidth + "px";
  }

  CalcolaOffset(bottone: HTMLElement, padding: number){
    let offset = padding;
    
    for(const b of Array.from(this.cont.nativeElement.querySelectorAll(".overlay button"))){
      if(b === bottone) return offset;
      offset += (b as HTMLElement).clientWidth + padding;
    }

    return offset;
  }

}
