import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfrontaPassword } from 'src/app/utils/Input';
import { TransizioneService } from '../../servizio-transizione.service';
import { TooltipComponent } from './tooltip/tooltip.component';
import { CambioPasswordService } from './cambio-password.service';
import { animazione } from '../../../comuni/animazioni/appari-disappari';
import { InputPasswordComponent } from 'src/app/comuni/elementi-form/input-password/input-password.component';
import { SincronizzazioneService } from '../sincronizzazione.service';
import { Router } from '@angular/router';
import { AxiosError } from 'axios';
import { NotificheService } from 'src/app/comuni/notifiche/notifiche.service';

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
    private notifiche: NotificheService
  ){}

  @ViewChild("formHtml")
  formHtml!: ElementRef<HTMLElement>

  form: FormGroup = new FormGroup({
    password: new FormControl("", [Validators.required]),
    conferma: new FormControl("", [Validators.required])
  })

  formValido: boolean = false;
  tooltip: boolean = false;

  async ngOnInit(): Promise<void> {
    try
    {
      await this.servizio.VerificaRecupero();
    }
    catch(e)
    {
      if((e as AxiosError).response?.status == 405)
      {
        this.router.navigate(["/admin/home"])
      }
      else this.router.navigate(["/login"])
    }

    this.form.addValidators(
      ConfrontaPassword(this.form.get("password")!, this.form.get("conferma")!)
    )
  }

  ngAfterViewInit(): void {
    this.transizione.formVeri["/login/reset-password"] = this.formHtml.nativeElement;
  }

  async CambiaPassword(){
    this.transizione.caricamento = true
    try
    {  
      this.transizione.caricamento = false
      await this.servizio.CambiaPassword(this.form.controls["password"].value);
      this.transizione.TransizioneUscita(this.formHtml.nativeElement, "/login");
      setTimeout(() => {
        this.router.navigateByUrl("/login");
      }, 500);
    }
    catch(e)
    {
      this.transizione.caricamento = false
      this.notifiche.NuovaNotifica({
        "tipo": "errore",
        "titolo": "Qualcosa è andato storto"
      })
    }
  }

  MostraTooltip(){
    this.tooltip = true;
    setTimeout(() => this.servizio.Controlla(this.form.controls["password"].value), 50)
  }

  Controlla(e: Event){
    const val = (e.target as HTMLInputElement).value;
    this.servizio.Controlla(val)
  }

  ControllaPasswordUguale(){
    if(!this.form.valid){
      this.sinc.errori['conferma'] = "Le password non corrispondono"
    }
  }
}
