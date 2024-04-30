import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { DataInStringa } from 'src/app/utils/funzioni';


@Component({
  selector: 'GraficoLinea',
  templateUrl: './grafico-linea.component.html',
  styleUrls: ['./grafico-linea.component.scss'],
  standalone: true
})
export class GraficoLineaComponent implements AfterViewInit{

  @ViewChild('linea') 
  canvas!: ElementRef<HTMLCanvasElement>;


  constructor() { }

  public chart: any;

  ngAfterViewInit(): void {
    this.chart = new Chart("linea", {
      type: 'line',

      data: {
        labels: this.PrendiSettimane(6), 
	       datasets: [
          {
            data: ['14','20', '25', '19', '18','30', '27', '20'],
            fill: true,
            borderColor: 'hsla(197, 52%, 30%, .75)',
            backgroundColor: this.CreaGradient(),
            tension: .5,
            
          }
        ]
      },
      options: {
        animation: {
          duration: 2000,
          easing: 'easeInOutQuint'
        },
        responsive: true,
        // aspectRatio:2.5,
        maintainAspectRatio: false,
        elements: {
          "point": {
            "radius": 0
          },
          line: {
            "borderWidth": 1
          }
        },
        scales: {
          "x" : {
            "grid" : {
              "display" : false,
            },
            "border" : {
              "display" : false,
            },
            "ticks" : {
              "color" : "#AAA",
              "font" : {
                "size" : 14,
                "family" : "Inter var",
              }
            }
          },
          "y" : {
            "beginAtZero" : true,
            "grid" : {
              "display" : false
            },
            "border" : {
              "display" : false,
            },
            "ticks" : {
              "color" : "#AAA",
              "font" : {
                "size" : 14,
                "family" : "Inter var",
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        },
      },
      
      
    });
  }

  PrendiSettimane(numero: number) {
    const datePassate = [];
    const oggi = new Date();
  
    for (let i = 0; i < numero; i++) {
      const dataPassata = new Date(oggi.getTime() - (i * 7 * 24 * 60 * 60 * 1000));
      datePassate.push(dataPassata.toLocaleDateString("it-IT", {
        day: "2-digit",
        month: "2-digit"
      }));
    }
  
    return datePassate.reverse();
  }
  
  CreaGradient(): CanvasGradient{
    const gradient = this.canvas.nativeElement.getContext('2d')!.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'hsla(197, 52%, 30%, 1)');   
    gradient.addColorStop(.5, 'hsla(197, 52%, 30%, .75)');   
    gradient.addColorStop(1, 'hsla(197, 52%, 30%, 0)');
    return gradient;
  }

}
