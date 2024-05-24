import { Component, OnInit, inject, OnDestroy, ViewChild, ElementRef, AfterViewInit, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginService } from './login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AxiosError } from 'axios';
import { LoginGoogleComponent } from './bottone-login-google/login-google.component';
import { MicrosoftLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Subscription } from 'rxjs';
import { FintoHrComponent } from 'src/app/comuni/finto-hr/finto-hr.component';
import { TransizioneService } from '../../servizio-transizione.service';
import { InputTextComponent } from 'src/app/comuni/elementi-form/input-text/input-text.component';
import { InputPasswordComponent } from 'src/app/comuni/elementi-form/input-password/input-password.component';
import { SincronizzazioneService } from '../sincronizzazione.service';
import { LoginMicrosoftComponent } from './bottone-login-microsoft/login-microsoft.component';
import { NotificheService } from 'src/app/comuni/notifiche/notifiche.service';
import { BottoneLoginAppleComponent } from './bottone-login-apple/bottone-login-apple.component';

@Component({
  selector: 'form-login',
  templateUrl: './login.component.html',
  styleUrls: ['../../stile-form.scss', '../stile-form.scss', './login.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, LoginGoogleComponent, FintoHrComponent, InputTextComponent, InputPasswordComponent, LoginMicrosoftComponent, BottoneLoginAppleComponent],
  standalone: true,
})
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(
    private servizio : LoginService, 
    private authService: SocialAuthService, 
    public transizione : TransizioneService, 
    private router : Router,
    public sinc: SincronizzazioneService,
    public notifiche: NotificheService
  ) {}

  private activatedRoute = inject(ActivatedRoute);
  private username = this.activatedRoute.snapshot.queryParams["username"] || "";

  form : FormGroup = new FormGroup({
    username : new FormControl(this.username, [Validators.required, Validators.minLength(3)]),
    password : new FormControl("", [Validators.required])
  });

  authSubscription!: Subscription;
  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  ngOnInit() {
    this.authSubscription = this.authService.authState.subscribe((user : SocialUser) => {
      this.servizio.LoginOAuth(user)
      .then((info) => {
        info = info["data"];
        
        if("deveCambiare" in info)
        {
          this.transizione.TransizioneUscita(this.formHtml.nativeElement, "/login/cambio-password");
          setTimeout(() => {
            this.router.navigateByUrl("/login/cambio-password");
          }, 500);
        }
        else if("2FA" in info && !info["2FA"])
        {
          this.transizione.TransizioneUscita(this.formHtml.nativeElement, "/login/verifica");
          setTimeout(() => {
            this.router.navigateByUrl("/login/verifica");
          }, 500);
        }
        else this.router.navigate(["/admin/home"])
      })
      .catch((e : AxiosError) => this.GestisciErrore(e))
    });
    
    this.sinc.valori["username"] =  this.username;
  }

  @ViewChild("formHtml")
  formHtml!: ElementRef<HTMLElement>

  ngAfterViewInit(): void {
    this.transizione.formVeri["/login"] = this.formHtml.nativeElement;
  }


  googleSignin(googleWrapper: any) {
    googleWrapper.click();
  }

  MicrosoftSignin(){
    this.authService.signIn(MicrosoftLoginProvider.PROVIDER_ID)
  }

  async Login(){
    try
    {
      this.transizione.caricamento = true;
      let info = await this.servizio.Login(this.form.value["username"], this.form.value["password"]);
      this.transizione.caricamento = false;

      info = info["data"];
      
      if("deveCambiare" in info)
      {
        this.transizione.TransizioneUscita(this.formHtml.nativeElement, "/login/cambio-password");
        setTimeout(() => {
          this.router.navigateByUrl("/login/cambio-password");
        }, 500);
      }
      else if("2FA" in info && !info["2FA"])
      {
        this.transizione.TransizioneUscita(this.formHtml.nativeElement, "/login/verifica");
        setTimeout(() => {
          this.router.navigateByUrl("/login/verifica");
        }, 500);
      }
      else this.router.navigate(["/admin/home"])
    }
    catch(e) {this.GestisciErrore(e as AxiosError)}
  }

  private GestisciErrore(err : AxiosError){
    this.transizione.caricamento = false;
    switch(err.response?.status)
    {
      case 400:
        this.sinc.errori["username"] = "Username non esistente"
        break;
      case 401:
        this.sinc.errori["password"] = "Password errata"
        break;
      default:
        return this.notifiche.NuovaNotifica({
          "tipo" : "errore",
          "titolo" : "Qualcosa è andato storto"
        })
    }
  } 

  CredenzialiDimenticate(){
    this.transizione.TransizioneUscita(this.formHtml.nativeElement, "/login/recupero-credenziali");
    setTimeout(() => {
      this.router.navigateByUrl("/login/recupero-credenziali");
    }, 500);
  }

  AppleSignin(){
    const CLIENT_ID = "com.myapp.bundle.backend"
    const REDIRECT_API_URL = "https://bosio.zip/api/login-oauth"
    window.open(
        `https://appleid.apple.com/auth/authorize? +
            client_id=${CLIENT_ID}& +
            redirect_uri=${encodeURIComponent(REDIRECT_API_URL)}& +
            response_type=code id_token& +
            scope=name email& +
            response_mode=form_post`,
        '_blank',
        "width=400,height=500,menubar=no,location=no,status=no"
    );
  }

}
