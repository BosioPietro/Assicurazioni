import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TooltipComponent } from './tooltip/tooltip.component';
import { CambioPasswordService } from './cambio-password.service';

@Component({
  selector: 'app-cambio-password',
  templateUrl: './cambio-password.page.html',
  styleUrls: ['./cambio-password.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, TooltipComponent]
})
export class CambioPasswordPage implements OnInit{

  public tooltip : boolean = false;

  form : FormGroup = new FormGroup({
    password : new FormControl("", [Validators.required]),
    conferma : new FormControl("", [Validators.required])
  });

  constructor(public servizio : CambioPasswordService){}

  ngOnInit(): void {
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

  Controlla(){
    this.servizio.Controlla(this.form.controls["password"].value)
  }

  Cambia(){

  }
}
