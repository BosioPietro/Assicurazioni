import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'Utenti',
  templateUrl: './utenti.page.html',
  styleUrls: ['./utenti.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class UtentiPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
