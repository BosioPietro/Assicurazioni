import { Injectable } from '@angular/core';
import { GestoreServerService } from 'src/app/server/gestore-server.service';
import { Metodi } from 'src/app/utils/TipiSpeciali';
import { Perizia } from './perizia.model';
import { AxiosResponse } from 'axios';


@Injectable({
  providedIn: 'root'
})
export class PeriziaService {

  constructor(private server: GestoreServerService) { }

  PrendiPerizia(idPerizia: string) {
    return new Promise<Perizia | undefined>((resolve) => {
      this.server.InviaRichiesta(Metodi.GET, `/api/perizia/${idPerizia}`)
      .then((res: AxiosResponse) => resolve(res["data"]))
      .catch(() => resolve(undefined));
    });
  }

  PrendiOperatori() {
    return new Promise<Record<string, any>[]>((resolve, reject) => {
      this.server.InviaRichiesta(Metodi.GET, `/api/operatori`)
      .then((res: AxiosResponse) => resolve(res["data"]))
      .catch(() => reject());
    });
  }

  EliminaPerizia(idPerizia: number) {
    return new Promise<void>((resolve, reject) => {
      this.server.InviaRichiesta(Metodi.DELETE, `/api/perizia/${idPerizia}`)
      .then(() => resolve())
      .catch(() => reject());
    });
  }
}
