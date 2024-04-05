import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { animazione } from 'src/app/comuni/animazioni/appari-disappari';
import { InputPasswordComponent } from 'src/app/comuni/elementi-form/input-password/input-password.component';
import { InfoComponent } from 'src/app/comuni/info/info.component';
import { SincronizzazioneService } from '../sincronizzazione.service';

@Component({
  selector: 'app-cambio-password',
  templateUrl: './cambio-password.component.html',
  styleUrls: ['../../stile-form.scss', './cambio-password.component.scss'],
  imports: [IonicModule, CommonModule, InfoComponent, InputPasswordComponent],
  animations: [animazione],
  standalone: true,
})
export class CambioPasswordFinto{

  @ViewChild("formCambio")
  formHTML! : ElementRef<HTMLElement>

  constructor(public sinc: SincronizzazioneService){}

}
