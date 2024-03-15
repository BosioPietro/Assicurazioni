import { Component, OnInit } from '@angular/core';
import { MapService } from 'src/app/shared/map.service';

@Component({
  selector: 'app-info-window',
  templateUrl: './info-window.component.html',
  styleUrls: ['./info-window.component.scss'],
  standalone: true
})
export class InfoWindowComponent  implements OnInit {

  constructor(public mapService:MapService) { }

  ngOnInit() {
    setInterval(()=>{console.log(this.mapService.markerCoords)}, 1000)
  }
  
}
