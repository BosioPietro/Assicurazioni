import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { TransizioneService } from '../../servizio-transizione.service';

@Component({
  selector: 'ResetPasswordFinto',
  templateUrl: './reset-password-form-mockup.component.html',
  styleUrls: ['./reset-password-form-mockup.component.scss'],
  standalone: true
})
export class ResetPasswordFinto  implements AfterViewInit {
  constructor(private transizione: TransizioneService){}

  @ViewChild("formHtml")
  formHtml!: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    this.transizione.AggiungiForm(this.formHtml.nativeElement, "/login/reset-password")
  }
}
