import { Component, Input } from '@angular/core';
import Utente from '../utente.model';
import { CheckboxModule } from 'primeng/checkbox';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'Utente',
  templateUrl: './utente.component.html',
  styleUrls: ['./utente.component.scss'],
  imports: [CheckboxModule, IonIcon],
  standalone: true
})
export class UtenteComponent {

  @Input() 
  utente!: Utente;
  

}
