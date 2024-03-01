import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Metodi from './metodi.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GestoreServerService {

  constructor(private http: HttpClient) { }

  public InviaRichiesta(method: Metodi, url: string, parameters: any = {}) {
    url = `http://localhost:3000${url}`;
    switch (method) {
      case Metodi.GET: 
      return firstValueFrom(this.http.get(url, {params: parameters}));
      case Metodi.POST:
      return firstValueFrom(this.http.post(url, parameters));
      case Metodi.PUT:
      return firstValueFrom(this.http.put(url, parameters));
      case Metodi.PATCH:
      return firstValueFrom(this.http.patch(url, parameters));
      case Metodi.DELETE:
      return firstValueFrom(this.http.delete(url, {params: parameters}));
    }
  }
}
