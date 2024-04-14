import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { InputCodiceComponent } from 'src/app/comuni/elementi-form/input-codice/input-codice.component';
import { SincronizzazioneService } from '../sincronizzazione.service';
import { TransizioneService } from '../../servizio-transizione.service';
import { Router } from '@angular/router';
import { NotificheService } from 'src/app/comuni/notifiche/notifiche.service';

@Component({
  selector: 'app-verifica',
  templateUrl: './verifica.component.html',
  styleUrls: ['../../stile-form.scss', '../stile-form.scss'],
  imports: [InputCodiceComponent],
  standalone: true
})
export class VerificaComponent implements AfterViewInit {

  @ViewChild("form")
  formHtml!:ElementRef<HTMLElement>;

  constructor(
    public sinc: SincronizzazioneService, 
    private transizione: TransizioneService,
    private router: Router,
    private notifiche: NotificheService
  ) { }

  ngAfterViewInit(): void {
    this.transizione.formVeri["/login/verifica"] = this.formHtml.nativeElement;
  }

  VerificaCodice(){

  }

  InviaCodice(){
    try
    {
      this.transizione.caricamento = true;

      this.transizione.caricamento = false;
      this.notifiche.NuovaNotifica({
        tipo: "info",
        titolo: "Codice Inviato"
      })
    }
    catch(e){
      this.transizione.caricamento = false;

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
