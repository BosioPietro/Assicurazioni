import { Component } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'UtentePlaceholder',
  templateUrl: './utente-placeholder.component.html',
  styleUrls: ['./utente-placeholder.component.scss'],
  imports: [CheckboxModule, IonIcon],
  standalone: true
})
export class UtentePlaceholderComponent{

}
