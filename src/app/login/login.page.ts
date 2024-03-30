import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TransizioneService } from './servizio-transizione.service';
import { LoginFinto } from './form-login-mockup/login-mockup.component';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { RecuperoCredenzialiFinto } from './recupero-credenziali/form-recupero-credenziali-mockup/recupero-credenziali-mockup.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RecuperoCredenzialiFinto, LoginFinto]
})
export class LoginPage implements OnInit, AfterViewInit {

  constructor(private transizione: TransizioneService, private router : Router){}
  
  @ViewChild("main")
  main!: ElementRef<HTMLElement>;


  @ViewChild("overlay")
  overlay!: ElementRef<HTMLElement>;
  
  ngOnInit(): void {
    this.router.events.subscribe((e) => {
      if(e instanceof NavigationStart )
      { 
        this.transizione.ultimaRoute = this.router.url;
      }
      else if(e instanceof NavigationEnd && this.transizione.inTransizione)
      {
        this.transizione.routeAttuale = this.router.url;
        this.transizione.MostraOverlay();
      }
    })
  }

  ngAfterViewInit(): void {
    this.transizione.main = this.main.nativeElement;
    this.transizione.overlay = this.overlay.nativeElement;
  }

}
