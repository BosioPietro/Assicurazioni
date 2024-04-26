import { Injectable } from '@angular/core';
import { GestoreServerService } from '../server/gestore-server.service';
import { Metodi } from '../utils/TipiSpeciali';
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

  PrendiOperatore(codOperatore: string) {
    return new Promise<string>((resolve, reject) => {
      this.server.InviaRichiesta(Metodi.GET, `/api/operatore/${codOperatore}`)
      .then((res: AxiosResponse) => resolve(res["data"]["nome"]))
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
