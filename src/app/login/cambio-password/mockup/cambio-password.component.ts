import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { animazione } from 'src/app/comuni/animazioni/appari-disappari';
import { InputPasswordComponent } from 'src/app/comuni/elementi-form/input-password/input-password.component';
import { InfoComponent } from 'src/app/comuni/info/info.component';
import { SincronizzazioneService } from '../sincronizzazione.service';
import { TransizioneService } from '../../servizio-transizione.service';
import { PopOverComponent } from 'src/app/comuni/pop-over/pop-over.component';

@Component({
  selector: 'CambioPasswordFinto',
  templateUrl: './cambio-password.component.html',
  styleUrls: ['../../stile-form.scss', '../stile-form.scss'],
  imports: [IonicModule, CommonModule, InfoComponent, InputPasswordComponent, PopOverComponent],
  animations: [animazione],
  standalone: true,
})
export class CambioPasswordFinto{

  @ViewChild("formCambio")
  formHTML! : ElementRef<HTMLElement>

  constructor(public sinc: SincronizzazioneService, public transizione: TransizioneService){}

  
  ngAfterViewInit(): void {
    this.transizione.AggiungiForm(this.formHTML.nativeElement, "/login/cambio-password")
  }

}
