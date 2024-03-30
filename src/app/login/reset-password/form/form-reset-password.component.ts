import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfrontaPassword } from 'src/app/utils/Input';
import { TransizioneService } from '../../servizio-transizione.service';
import { TooltipComponent } from './tooltip/tooltip.component';
import { CambioPasswordService } from './cambio-password.service';
import { animazione } from './animazioni';

@Component({
  selector: 'app-reset-password',
  templateUrl: './form-reset-password.component.html',
  styleUrls: ['./form-reset-password.component.scss'],
  imports: [ReactiveFormsModule, TooltipComponent],
  animations: [animazione],
  standalone: true
})
export class ResetPasswordComponent implements OnInit, AfterViewInit{
  
  constructor(private transizione: TransizioneService, public servizio:CambioPasswordService){}

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

  }

  MostraTooltip(){
    this.tooltip = true;
    setTimeout(() => this.servizio.Controlla(this.form.controls["password"].value), 50)
  }

  Controlla(){
    this.servizio.Controlla(this.form.controls["password"].value)
  }
}
