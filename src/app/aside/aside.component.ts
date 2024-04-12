import { Component, OnInit } from '@angular/core';
import { AsideComponentComponent } from './aside-component/aside-component.component';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss'],
  imports: [AsideComponentComponent],
  standalone: true
})
export class AsideComponent  implements OnInit {

  constructor() { }
  elencoVoci:any[] = ["Voce1","Voce2","Voce3","Voce4","Voce5","Voce6","Voce7","Voce8","Voce9","Voce10",]
  ngOnInit() {}

}
