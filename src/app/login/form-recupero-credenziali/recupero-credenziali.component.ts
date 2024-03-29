import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransizioneService } from '../servizio-transizione.service';
import { Router } from '@angular/router';

@Component({
  selector: 'form-recupero-credenziali',
  templateUrl: './recupero-credenziali.component.html',
  standalone: true,
  styleUrls: ['./recupero-credenziali.component.scss'],
  imports: [ReactiveFormsModule]
})
export class RecuperoCredenzialiComponent implements AfterViewInit{
  
  constructor(private transizione : TransizioneService, private router : Router){}

  form : FormGroup = new FormGroup({
    "mail-recupero" : new FormControl("", [Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)])
  })

  @ViewChild("formHtml")
  formHtml!: ElementRef<HTMLElement>

  ngAfterViewInit(): void {
    this.transizione.formVeri["/login/recupero-credenziali"] = this.formHtml.nativeElement;
  }

  NavigaLogin(){
    this.transizione.TransizioneUscita(this.formHtml.nativeElement, "/login");
      setTimeout(() => {
        this.router.navigateByUrl("/login");
      }, 500);
  }
}
