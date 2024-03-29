import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TransizioneService } from '../servizio-transizione.service';

@Component({
  selector: 'RecuperoCredenzialiFinto',
  templateUrl: './recupero-credenziali-mockup.component.html',
  styleUrls: ['./recupero-credenziali-mockup.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class RecuperoCredenzialiFinto implements AfterViewInit{

  constructor(private transizione: TransizioneService){}

  @ViewChild("form")
  formHtml!: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    this.transizione.AggiungiForm(this.formHtml.nativeElement, "/login/recupero-credenziali")
  }
}
