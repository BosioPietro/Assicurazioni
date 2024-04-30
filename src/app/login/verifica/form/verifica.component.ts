import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { InputCodiceComponent } from 'src/app/comuni/elementi-form/input-codice/input-codice.component';
import { SincronizzazioneService } from '../sincronizzazione.service';
import { TransizioneService } from '../../servizio-transizione.service';
import { Router } from '@angular/router';
import { NotificheService } from 'src/app/comuni/notifiche/notifiche.service';
import { ControllaToken } from 'src/app/utils/funzioni';
import { VerificaService } from '../verifica.service';
import { AxiosError } from 'axios';

@Component({
  selector: 'app-verifica',
  templateUrl: './verifica.component.html',
  styleUrls: ['../../stile-form.scss', '../stile-form.scss'],
  imports: [InputCodiceComponent],
  standalone: true
})
export class VerificaComponent implements AfterViewInit, OnInit {

  @ViewChild("form")
  formHtml!:ElementRef<HTMLElement>;

  constructor(
    public sinc: SincronizzazioneService, 
    private transizione: TransizioneService,
    private router: Router,
    private notifiche: NotificheService,
    private server: VerificaService
  ) { }

  ngOnInit(): void {
    ControllaToken(this.router);
  }

  ngAfterViewInit(): void {
    this.transizione.formVeri["/login/verifica"] = this.formHtml.nativeElement;
    this.InviaCodice(false)

    setTimeout(() => {
      const input : HTMLInputElement | null = this.formHtml.nativeElement.querySelector("InputCodice input")
      input?.focus();
    }, 100);
  }

  async VerificaCodice(){
    try
    {
      this.transizione.caricamento = true;
      await this.server.VerificaCodice(this.sinc.valori["codice"])
      this.transizione.caricamento = false;

      this.router.navigateByUrl("/admin/home")
    }
    catch(e){
      this.transizione.caricamento = false;
      this.GestisciErrore(e as AxiosError)
    }
  }

  GestisciErrore(e: AxiosError){
    const { status } = e.response!;

    if(status == 401)
    {
      this.sinc.errori["codice"] = "Codice errato"
      return; 
    }

    this.notifiche.NuovaNotifica({
      tipo: "errore",
      titolo: "Errore",
      descrizione: "Qualcosa è andato storto"
    })
  }

  async InviaCodice(notifica: boolean = true){
    try
    {
      this.transizione.caricamento = true;
      await this.server.InviaCodice()
      this.transizione.caricamento = false;

      if(notifica){
        this.notifiche.NuovaNotifica({
          tipo: "info",
          titolo: "Codice Inviato"
        })
      }
    }
    catch(e){
      this.transizione.caricamento = false;
      this.notifiche.NuovaNotifica({
        tipo: "errore",
        titolo: "Errore",
        descrizione: "Qualcosa è andato storto"
      })
    }
  }

  ControllaCodice(e : [boolean, string]){
    const [valido, codice] = e;

    this.sinc.codiceCorretto = valido;
    this.sinc.valori["codice"] = codice;
  }

  NavigaLogin(){
    this.transizione.TransizioneUscita(this.formHtml.nativeElement, "/login");
      setTimeout(() => {
        this.router.navigateByUrl("/login");
      }, 500);
  }
}
