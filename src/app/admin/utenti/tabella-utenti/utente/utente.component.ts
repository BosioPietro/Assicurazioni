import { Component, Input } from '@angular/core';
import Utente from '../utente.model';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { IonIcon } from '@ionic/angular/standalone';
import { ImmagineProfiloDefault } from 'src/app/comuni/immagine-profilo-default/immagine-profilo-default.component';
import { TabellaService } from '../../tabella.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'Utente',
  templateUrl: './utente.component.html',
  styleUrls: ['./utente.component.scss'],
  imports: [CheckboxModule, IonIcon, ImmagineProfiloDefault, FormsModule],
  standalone: true
})
export class UtenteComponent{

  constructor(public tabella: TabellaService) { }

  @Input() 
  utente!: Utente;

  Seleziona(e: CheckboxChangeEvent){
    const { checked } = e;

    if(checked)
    {
      this.tabella.SelezionaUtente(this.utente);
    }
    else this.tabella.DeselezionaUtente(this.utente);
  }
}
