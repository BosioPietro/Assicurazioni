import { Injectable } from '@angular/core';
import axios, { AxiosRequestConfig } from 'axios';
import { Metodi } from '../utils/TipiSpeciali';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GestoreServerService{

async InviaRichiesta(method : Metodi, url : string, parameters : object = {}) {
    const indirizzo = {
      baseURL: url.startsWith("http") ? "" : environment.BASE_URL_SERVER + environment.PORTA_SERVER,
      url: url
    }

    const config : AxiosRequestConfig = {
      ...indirizzo, 
      "method": method.toString(),
      "headers": {
        "Accept": "application/json",
      },
      "timeout": 15000,
      "responseType": "json",
    }
    
    if(parameters instanceof FormData){
      config.headers!["Content-Type"] = 'multipart/form-data;' 
      config["data"] = parameters
    }	
    else if(method === Metodi.GET){
        config.headers!["Content-Type"] = 'application/x-www-form-urlencoded;charset=utf-8' 
        config["params"] = parameters   
    }
    else{
      config.headers!["Content-Type"] = 'application/json; charset=utf-8' 
      config["data"] = parameters    
    }	
    return axios(config);          
  }

}

axios.interceptors["request"].use((config) => {
  if("token" in localStorage){
    config.headers["authorization"] = localStorage["token"];
  }
  return config;
});

axios.interceptors["response"].use((response) => {
  const token = response.headers["authorization"];
  
  if(token)
  {
    localStorage["token"] = token
  }
  else localStorage.removeItem("token")

  return response;
});