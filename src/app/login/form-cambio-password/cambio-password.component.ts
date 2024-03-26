import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TooltipComponent } from './tooltip/tooltip.component';
import { CambioPasswordService } from './cambio-password.service';
import { Router } from '@angular/router';
import { ControllaToken } from 'src/app/utils/funzioni';
import { InfoComponent } from 'src/app/comuni/info/info.component';
import { ErroreComponent } from 'src/app/comuni/errore/errore.component';

@Component({
  selector: 'app-cambio-password',
  templateUrl: './cambio-password.component.html',
  styleUrls: ['./cambio-password.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, TooltipComponent, InfoComponent, ErroreComponent]
})
export class CambioPasswordComponent implements OnInit, AfterViewInit{

  @ViewChild("formCambio")
  formHTML! : ElementRef<HTMLElement>

  public tooltip : boolean = false;

  form : FormGroup = new FormGroup({
    password : new FormControl("", [Validators.required]),
    conferma : new FormControl("", [Validators.required])
  });

  constructor(public servizio : CambioPasswordService){}

  router : Router = new Router();
  giorniMancanti? : number;

  ngAfterViewInit(): void {
    setTimeout(() => this.formHTML.nativeElement.classList.add("transizione-in"), 1)
  }

  async ngOnInit(){
    const info : any = await ControllaToken(this.router);
    this.giorniMancanti = info["giorniMancanti"]
    console.log(this.giorniMancanti)
    this.form.addValidators(
      this.ConfrontaPassword(this.form.get("password")!, this.form.get("conferma")!)
    )
  }

  ConfrontaPassword(controlOne: AbstractControl, controlTwo: AbstractControl) {
      return () => {
        if (controlOne.value !== controlTwo.value)
        {
          return { match_error: 'Value does not match' };
        }
        else return null;
    };
  }

  MostraTooltip(){
    this.tooltip = true;
    setTimeout(() => this.servizio.Controlla(this.form.controls["password"].value), 50)
  }

  Controlla(){
    this.servizio.Controlla(this.form.controls["password"].value)
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
