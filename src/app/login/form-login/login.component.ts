import { Component, OnInit, inject, OnDestroy, ViewChild, ElementRef, AfterViewChecked, AfterContentInit, AfterViewInit, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginService } from './login.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AxiosError } from 'axios';
import { LoginGoogleComponent } from './bottone-login-google/login-google.component';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Subscription } from 'rxjs';
import { FintoHrComponent } from 'src/app/comuni/finto-hr/finto-hr.component';
import { TransizioneService } from '../servizio-transizione.service';


@Component({
  selector: 'form-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, LoginGoogleComponent, FintoHrComponent],
})
export class LoginComponent implements OnInit, OnDestroy {

  router = new Router();

  constructor(private servizio : LoginService, private authService: SocialAuthService, private transizione : TransizioneService) {
  }
  
  @ViewChild("formLogin")
  formHtml! : ElementRef<HTMLElement>;

  @ViewChild("logo")
  logoHtml! : ElementRef<HTMLElement>;

  @ViewChild("wrapperInput")
  wrapperInput! : ElementRef<HTMLElement>;

  private activatedRoute = inject(ActivatedRoute);

  private username = this.activatedRoute.snapshot.queryParams["username"] || "";

  form : FormGroup = new FormGroup({
    username : new FormControl(this.username, [Validators.required]),
    password : new FormControl("", [Validators.required])
  });

  authSubscription!: Subscription;
  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  ngOnInit() {
    this.authSubscription = this.authService.authState.subscribe((user : SocialUser) => {
      localStorage.setItem("user", user["idToken"]);
      this.servizio.LoginGoogle(user)
      .then(() => this.router.navigate(["/home"]))
      .catch((e : AxiosError) => this.GestisciErrore(e))
    });

    this.router.events.subscribe((e) => {
      if(e instanceof NavigationEnd && this.router.url == "/login")
      {
        if(this.transizione.ultimaRoute)
        {
          this.wrapperInput.nativeElement.classList.add("nascosto")
          this.wrapperInput.nativeElement.classList.add("transizione-x2")
        }
        
        if(!this.logoHtml.nativeElement.getBoundingClientRect().left)
        {
          this.logoHtml.nativeElement.classList.add("nascosto")
        }
        setTimeout(() => {
          
          setTimeout(() => this.wrapperInput.nativeElement.classList.remove("nascosto"), 250)

          this.logoHtml.nativeElement.classList.remove("nascosto")
          this.transizione.AperturaForm(this.formHtml.nativeElement);
          this.transizione.SpostamentoLogo(this.logoHtml.nativeElement);
        }, 1)
      }
    })
  }

  googleSignin(googleWrapper: any) {
    googleWrapper.click();
  }

  async Login(){
    try
    {
      let info = await this.servizio.Login(this.form.value["username"], this.form.value["password"]);
      info = info["data"];
      
      if("deveCambiare" in info)
      {
        this.router.navigate(["/login/cambio-password"])
      }
      else this.router.navigate(["/home"]);
    }
    catch(e) {this.GestisciErrore(e as AxiosError)}
  }
  
  private GestisciErrore(err : AxiosError){
    switch(err.response?.status)
    {
      case 500: 
        return alert("Errore interno del server");
      case 400:
        return alert("Username non esistente")
      case 401:
        return alert("Password errata")
      default:
        return alert(`Errore: ${err.response?.data} (${err.response?.status})`);
    }
  }

  CredenzialiDimenticate(){
    this.logoHtml.nativeElement.classList.remove("transizione-x2");
    this.transizione.CalcolaWidth(this.formHtml.nativeElement, this.router.url)
    this.transizione.PosizioneLogo(this.logoHtml.nativeElement, this.router.url)
    this.transizione.MostraProssimoWrapper("/login/recupero-credenziali")
    this.transizione.NascondiWrapperTransizione(this.formHtml.nativeElement, this.router.url)
    this.router.navigateByUrl("/login/recupero-credenziali")
  }

}
