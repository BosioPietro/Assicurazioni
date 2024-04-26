import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Immagine } from '../perizia.model';
import { IonIcon } from '@ionic/angular/standalone';
import { animazione } from 'src/app/comuni/animazioni/appari-disappari';

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

  ngAfterViewInit() {
    this.modale.nativeElement.showModal();
  }
  
  indice: number = 0;


  Cambia(mod: boolean){
    mod ? this.indice++ : this.indice--;
  }
}
