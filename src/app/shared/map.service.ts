import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MapService {
  markerCoordsObservable = new Subject<any>();
  flagInfoWindow:boolean = false;
  constructor() { }
  markerCoords:any;
}
