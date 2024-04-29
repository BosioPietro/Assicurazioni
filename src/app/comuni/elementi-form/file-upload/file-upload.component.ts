import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { NotificheService } from '../../notifiche/notifiche.service';
import { ContenitoreNotificheComponent } from '../../notifiche/contenitore-notifiche/contenitore-notifiche.component';

@Component({
  selector: 'FileUpload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  imports: [IonIcon, ContenitoreNotificheComponent],
  standalone: true
})
export class FileUploadComponent  implements AfterViewInit {

  @ViewChild("dialogo")
  modale!: ElementRef<HTMLDialogElement>;

  @Output()
  onChiudi = new EventEmitter<void>();

  @Output()
  onConferma = new EventEmitter<File>();

  @Input()
  inCaricamento! : boolean;

  constructor(private notifiche: NotificheService) { }

  ngAfterViewInit(): void {
    this.modale.nativeElement.showModal();
  }

  draggando: boolean = false;
  immagine?: File;

  DragStart(e: DragEvent){
    e.preventDefault();
    this.draggando = true;
  }

  DragEnd(e: DragEvent){
    e.preventDefault();
    this.draggando = false;
  }

  DropImmagine(e: DragEvent){
    e.preventDefault();
    e.stopPropagation();
    this.draggando = false;
    
    const img = e.dataTransfer!.files[0];
    
    if(!img.type.startsWith("image/")){
      this.notifiche.NuovaNotifica({
        titolo: "Tipo file non supportato",
        tipo: "errore"
      })
      return;
    }

    if(img.size > 1024 * 1024){
      
    }
    this.immagine = img;
  }

  Chiudi(){
    this.modale.nativeElement.classList.add("chiudi");
    setTimeout(() => {
      this.modale.nativeElement.close()
      this.modale.nativeElement.classList.remove("chiudi");
      this.onChiudi.emit();
    }, 301);
  }

}
