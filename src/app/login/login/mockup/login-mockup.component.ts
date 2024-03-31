import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FintoHrComponent } from 'src/app/comuni/finto-hr/finto-hr.component';
import {  LoginGoogleFinto } from './bottone-login-google-mockup/login-google-mockup.component';
import { TransizioneService } from '../../servizio-transizione.service';

@Component({
  selector: 'LoginFinto',
  templateUrl: './login-mockup.component.html',
  styleUrls: ['../stile-form.scss','./login-mockup.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, LoginGoogleFinto, FintoHrComponent],
})
export class LoginFinto implements AfterViewInit{

  constructor(private transizione: TransizioneService){}

  @ViewChild("form")
  formHtml!: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    this.transizione.AggiungiForm(this.formHtml.nativeElement, "/login")
  }
}
