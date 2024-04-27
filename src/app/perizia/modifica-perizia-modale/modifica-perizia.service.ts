import { Injectable } from "@angular/core";
import { AxiosError, AxiosResponse } from "axios";
import { Errore } from "src/app/comuni/elementi-form/ricerca/ricerca.component";
import { GestoreServerService } from "src/app/server/gestore-server.service";
import { Metodi } from "src/app/utils/TipiSpeciali";



@Injectable({
  providedIn: 'root'
})
export class ModificaPeriziaService {
  constructor(private server: GestoreServerService) {}

  CercaIndirizzi(valore: string){
    return new Promise<Record<string, any>[] | Errore>((resolve, reject) => {
        this.server.InviaRichiesta(Metodi.GET, "/api/indirizzi", { valore })
        .then((res: AxiosResponse) => {resolve(res["data"]["predictions"])})
        .catch((err: AxiosError) => {reject({messaggio: err.message, codice: err.response?.status || 500})})
    })
  }

  ControllaErrore(obj: Record<string, any> | Errore): obj is Errore {
    return "messaggio" in obj;
  }

  PrendiIndirizzo({ lat, lng }: { lat: number; lng: number }) {

    return new Promise<Record<string, any>[] | string>((resolve, reject) => {
      this.server.InviaRichiesta(Metodi.GET, "/api/geocode-coordinate", { lat, lng })
      .then((res: AxiosResponse) => {resolve(res["data"]["results"][0])})
      .catch((err: AxiosError) => {reject("")})
  })
  }
}