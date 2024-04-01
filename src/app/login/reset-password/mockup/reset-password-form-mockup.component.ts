import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { TransizioneService } from '../../servizio-transizione.service';
import { SincronizzazioneService } from '../sincronizzazione.service';
import { InputPasswordComponent } from 'src/app/comuni/elementi-form/input-password/input-password.component';

@Component({
  selector: 'ResetPasswordFinto',
  templateUrl: './reset-password-form-mockup.component.html',
  styleUrls: ['../stile-form.scss'],
  imports: [InputPasswordComponent],
  standalone: true
})
export class ResetPasswordFinto  implements AfterViewInit {
  constructor(private transizione: TransizioneService, public sinc: SincronizzazioneService){}

  @ViewChild("formHtml")
  formHtml!: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    this.transizione.AggiungiForm(this.formHtml.nativeElement, "/login/reset-password")
  }
}
