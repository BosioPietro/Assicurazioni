import { Component, Input } from '@angular/core';

@Component({
  selector: 'ImmagineProfileDefault',
  templateUrl: './immagine-profilo-default.component.html',
  styleUrls: ['./immagine-profilo-default.component.scss'],
  standalone: true
})
export class ImmagineProfiloDefault {
  @Input("nome")
  nome!: string;

  Angolo(s: string) {
    const somma = s.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return somma % 361;
  }
}
