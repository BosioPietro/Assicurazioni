import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'ModaleSiNo',
  templateUrl: './modale-si-no.component.html',
  styleUrls: ['./modale-si-no.component.scss'],
  imports: [IonIcon],
  standalone: true
})
export class ModaleSiNoComponent implements AfterViewInit {

  @ViewChild("dialogo")
  modale!: ElementRef<HTMLDialogElement>;

  @Input()
  titolo: string = "Conferma"; 

  @Input()
  messaggio: string = "Confermi l'operazione?";

  @Input()
  si: string = "Si";

  @Input()
  no: string = "Annulla";

  @Input()
  colore: string = "red";

  @Input()
  inCaricamento!: boolean;

  @Output()
  onSi = new EventEmitter<void>();

  @Output()
  onNo = new EventEmitter<void>();

  ngAfterViewInit() {
    this.modale.nativeElement.showModal();
  }

  ChiudiModale(stato: boolean) {
    if (stato) this.onSi.emit();
    else this.onNo.emit();
  }

}
