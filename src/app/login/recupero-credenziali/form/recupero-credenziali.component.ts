import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransizioneService } from '../../servizio-transizione.service';
import { Router } from '@angular/router';
import { InputCodiceComponent } from './input-codice/input-codice.component';
import { SincronizzazioneService } from '../sincronizzazione.service';
import { InputTextComponent } from 'src/app/comuni/elementi-form/input-text/input-text.component';
import { RegexInput } from 'src/app/utils/Input';
import { RimuoviParametri } from 'src/app/utils/funzioni';
import { AxiosError } from 'axios';
import { RecuperoCredenzialiService } from './recupero-credenziali.service';

@Component({
  selector: 'form-recupero-credenziali',
  templateUrl: './recupero-credenziali.component.html',
  standalone: true,
  styleUrls: ['../../stile-form.scss', '../stile-form.scss', './recupero-credenziali.component.scss'],
  imports: [ReactiveFormsModule, InputCodiceComponent, FormsModule, InputTextComponent],
})
export class RecuperoCredenzialiComponent implements AfterViewInit{
  
  constructor(
    public transizione: TransizioneService, 
    public sinc: SincronizzazioneService,
    private servizio: RecuperoCredenzialiService, 
    public router: Router
  ){}

  @ViewChild("formHtml")
  formHtml!: ElementRef<HTMLElement>

  public RimuoviParametri = RimuoviParametri;

  ngAfterViewInit(): void {
    this.transizione.formVeri["/login/recupero-credenziali"] = this.formHtml.nativeElement;
  }

  public formInvioMail : FormGroup = new FormGroup({
    "mail-recupero" : new FormControl("", [Validators.required, Validators.pattern(RegexInput["email"])])
  })

  private codice = ""

  NavigaLogin(){
    this.transizione.TransizioneUscita(this.formHtml.nativeElement, "/login");
      setTimeout(() => {
        this.router.navigateByUrl("/login");
      }, 500);
  }

  async InviaMail(){
    this.transizione.caricamento = true;
    try
    {
      await this.servizio.InviaMailRecupero(this.formInvioMail.get("mail-recupero")?.value);
      this.transizione.caricamento = false;  
      this.sinc.TransizioneForm(this.formHtml.nativeElement);
    }
    catch(e) {this.GestisciErroreMail(e as AxiosError)}
    finally{this.transizione.caricamento = false;}
    
  }

  ControllaCodice([corretto, codice]: [boolean, string]){
    this.sinc.codiceCorretto = corretto;
    this.codice = codice;
  }

  async ResetPassword(){
    try
    {
      await this.servizio.VerificaCodice(this.codice)

      this.transizione.TransizioneUscita(this.formHtml.nativeElement, "/login/reset-password");
      setTimeout(() => {
        this.router.navigateByUrl("/login/reset-password");
      }, 500);
    }
    catch(e) {this.GestisciErroreCodice(e as AxiosError)}
  }

  private GestisciErroreCodice(err : AxiosError){
    const { status, data } = err.response!;

    if(status == 403)
    {
      this.sinc.errori["codice"] = "Codice incoretto"
    }
    else alert(data)
  }

  private GestisciErroreMail(err : AxiosError){
    const { status, data } = err.response!;

    if(status == 400)
    {
      this.sinc.errori["mail"] = "Mail non registrata"
    }
    else alert(data)
  }


}
