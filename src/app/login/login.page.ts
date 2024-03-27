import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TransizioneService } from './servizio-transizione.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage implements AfterViewInit {

  constructor(private transizione : TransizioneService) { }

  @ViewChild("main")
  main! : ElementRef<HTMLElement>;

  ngAfterViewInit() {
    this.transizione.PrendiMain(this.main.nativeElement);
  }

}
