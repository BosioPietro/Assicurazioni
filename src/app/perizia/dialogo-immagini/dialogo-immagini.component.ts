import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Immagine } from '../perizia.model';
import { IonIcon } from '@ionic/angular/standalone';
import { animazione } from 'src/app/comuni/animazioni/appari-disappari';
import { RemInPx } from 'src/app/utils/funzioni';

@Component({
  selector: 'DialogoImmagini',
  templateUrl: './dialogo-immagini.component.html',
  styleUrls: ['./dialogo-immagini.component.scss'],
  imports: [IonIcon],
  animations: [animazione],
  standalone: true
})
export class DialogoImmaginiComponent implements AfterViewInit{

  @Input()
  immagini!: Immagine[];

  @Output()
  onChiudi = new EventEmitter<void>();

  @ViewChild("modale")
  modale!: ElementRef<HTMLDialogElement>;

  @ViewChild("cont")
  contImmagini!: ElementRef<HTMLElement>

  ngAfterViewInit() {
    this.modale.nativeElement.showModal();
    this.MuoviImmagine(0, true)

    setTimeout(() => {
      this.contImmagini.nativeElement.classList.add("transizione")
    });
  }

  W_IMMAGINE = 30
  GAP = 2

  Immagine(i: number){
    const immagini = this.contImmagini.nativeElement.querySelectorAll("img");
    immagini.forEach((i) => i.classList.remove("selezionata"))
    return Array.from(immagini)[i]
  }
  
  MuoviImmagine(indice: number, togliTransizione: boolean = false){
    const img = this.Immagine(indice);
    const cont = this.contImmagini.nativeElement;

    const wImmagine = RemInPx(img.style.getPropertyValue("--w-immagine"))
    const gap = RemInPx(cont.style.getPropertyValue("--gap"))

    let wFinale = 0;
    for(let i = 0; i < indice; ++i){
      wFinale += wImmagine + gap;
    }

    cont.style.setProperty("--x", `${-wFinale}px`)
    img.classList.add("selezionata")
    console.log(img)
  }
}
