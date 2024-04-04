import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CambioPasswordService } from './cambio-password.service';
import { Router } from '@angular/router';
import { ControllaToken, RimuoviParametri } from 'src/app/utils/funzioni';
import { InfoComponent } from 'src/app/comuni/info/info.component';
import { ErroreComponent } from 'src/app/comuni/errore/errore.component';
import { InputPasswordComponent } from 'src/app/comuni/elementi-form/input-password/input-password.component';
import { ConfrontaPassword } from 'src/app/utils/Input';
import { animazione } from 'src/app/comuni/animazioni/appari-disappari';
import { TooltipComponent } from './tooltip/tooltip.component';
import { SincronizzazioneService } from '../sincronizzazione.service';

@Component({
  selector: 'app-cambio-password',
  templateUrl: './cambio-password.component.html',
  styleUrls: ['../../stile-form.scss', './cambio-password.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, TooltipComponent, InfoComponent, ErroreComponent, InputPasswordComponent],
  animations: [animazione],
  standalone: true,
})
export class CambioPasswordComponent implements OnInit{

  @ViewChild("formCambio")
  formHTML! : ElementRef<HTMLElement>

  public tooltip : boolean = false;

  form : FormGroup = new FormGroup({
    password : new FormControl("", [Validators.required]),
    conferma : new FormControl("", [Validators.required])
  });

  constructor(public servizio : CambioPasswordService, public sinc: SincronizzazioneService){}

  router : Router = new Router();

  async ngOnInit(){
    const info : any = await ControllaToken(this.router);
    this.sinc.giorniMancanti = info["giorniMancanti"]

    this.form.addValidators(
      ConfrontaPassword(this.form.get("password")!, this.form.get("conferma")!)
    )
  }

  MostraTooltip(){
    this.tooltip = true;
    setTimeout(() => this.servizio.Controlla(this.form.controls["password"].value), 50)
  }

  Controlla($event : Event){
    const input = $event.target as HTMLInputElement;
    this.servizio.Controlla(input.value)
  }

  async Cambia(){
    if(!this.form.valid) return;

    try
    {
      await this.servizio.Cambia(this.form.controls["password"].value);
      this.router.navigate(["/home"]);
    }
    catch(e){ alert("errore") }
  }
}
