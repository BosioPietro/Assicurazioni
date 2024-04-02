import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfrontaPassword } from 'src/app/utils/Input';
import { TransizioneService } from '../../servizio-transizione.service';
import { TooltipComponent } from './tooltip/tooltip.component';
import { CambioPasswordService } from './cambio-password.service';
import { animazione } from './animazioni';
import { InputPasswordComponent } from 'src/app/comuni/elementi-form/input-password/input-password.component';
import { SincronizzazioneService } from '../sincronizzazione.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './form-reset-password.component.html',
  styleUrls: ['../../stile-form.scss', '../stile-form.scss', './form-reset-password.component.scss'],
  imports: [ReactiveFormsModule, TooltipComponent, InputPasswordComponent],
  animations: [animazione],
  standalone: true
})
export class ResetPasswordComponent implements OnInit, AfterViewInit{
  
  constructor(
    private transizione: TransizioneService, 
    public servizio: CambioPasswordService, 
    public sinc: SincronizzazioneService,
    public router: Router,
  ){}

  @ViewChild("formHtml")
  formHtml!: ElementRef<HTMLElement>

  form: FormGroup = new FormGroup({
    password: new FormControl("", [Validators.required]),
    conferma: new FormControl("", [Validators.required])
  })

  formValido: boolean = false;
  tooltip: boolean = false;

  ngOnInit(): void {
    this.form.addValidators(
      ConfrontaPassword(this.form.get("password")!, this.form.get("conferma")!)
    )
  }

  ngAfterViewInit(): void {
    this.transizione.formVeri["/login/reset-password"] = this.formHtml.nativeElement;
  }

  CambiaPassword(){
    this.transizione.TransizioneUscita(this.formHtml.nativeElement, "/login");
    setTimeout(() => {
      this.router.navigateByUrl("/login");
    }, 500);
  }

  MostraTooltip(){
    this.tooltip = true;
    setTimeout(() => this.servizio.Controlla(this.form.controls["password"].value), 50)
  }

  Controlla(e: Event){
    const val = (e.target as HTMLInputElement).value;
    this.servizio.Controlla(val)
  }
}
