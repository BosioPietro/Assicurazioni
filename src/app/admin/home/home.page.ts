import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GraficoLineaComponent } from './grafico-linea/grafico-linea.component';
import { GraficoBarreComponent } from './grafico-barre/grafico-barre.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, GraficoLineaComponent, GraficoBarreComponent]
})
export class HomePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
