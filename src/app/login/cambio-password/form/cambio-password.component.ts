import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { animazione } from 'src/app/comuni/animazioni/appari-disappari';
import { InputPasswordComponent } from 'src/app/comuni/elementi-form/input-password/input-password.component';
import { ErroreComponent } from 'src/app/comuni/errore/errore.component';
import { ConfrontaPassword, RegexInput } from 'src/app/utils/Input';
import { ControllaToken } from 'src/app/utils/funzioni';
import { PopOverComponent } from "../../../comuni/pop-over/pop-over.component";
import { TransizioneService } from '../../servizio-transizione.service';
import { SincronizzazioneService } from '../sincronizzazione.service';
import { CambioPasswordService } from './cambio-password.service';
import { TooltipComponent } from './tooltip/tooltip.component';
import { NotificheService } from 'src/app/comuni/notifiche/notifiche.service';

@Component({
    selector: 'app-cambio-password',
    templateUrl: './cambio-password.component.html',
    styleUrls: ['../../stile-form.scss', '../stile-form.scss'],
    animations: [animazione],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, TooltipComponent, ErroreComponent, InputPasswordComponent, PopOverComponent]
})
export class CambioPasswordComponent implements OnInit{

  @ViewChild("formCambio")
  formHTML! : ElementRef<HTMLElement>

  public tooltip : boolean = false;

  form : FormGroup = new FormGroup({
    password : new FormControl("", [Validators.required, Validators.pattern(RegexInput["password"])]),
    conferma : new FormControl("", [Validators.required])
  });

  constructor(
    public servizio : CambioPasswordService, 
    public sinc: SincronizzazioneService, 
    public transizione: TransizioneService,
    public notifiche: NotificheService
  ){}

  router : Router = new Router();

  async ngOnInit(){
    const info : any = await ControllaToken(this.router);
    this.sinc.giorniMancanti = info["giorniMancanti"]

    this.form.addValidators(
      ConfrontaPassword(this.form.get("password")!, this.form.get("conferma")!)
    )
  }

  ngAfterViewInit(): void {
    this.transizione.formVeri["/login/cambio-password"] = this.formHTML.nativeElement;
  }


  MostraTooltip(){
    this.tooltip = true;
    setTimeout(() => this.servizio.Controlla(this.form.controls["password"].value), 50)
  }

  Controlla(event : Event){
    const input = event.target as HTMLInputElement;
    this.servizio.Controlla(input.value)
  }

  async Cambia(){
    if(!this.form.valid) return;

    this.transizione.caricamento = true;

    try
    {
      await this.servizio.Cambia(this.form.controls["password"].value);
      this.transizione.caricamento = false;  
      this.router.navigate(["/home"]);
    }
    catch(e)
    { 
      this.transizione.caricamento = false; 
      this.notifiche.NuovaNotifica({
        tipo: "errore",
        titolo: "Qualcosa è andato storto"
      })
    }
  }
}
