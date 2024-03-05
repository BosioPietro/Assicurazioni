import { Injectable } from '@angular/core';
import axios, { AxiosRequestConfig } from 'axios';
import environment from '../environment';
import { Metodi } from '../utils/TipiSpeciali';

@Injectable({
  providedIn: 'root'
})
export class GestoreServerService{

async InviaRichiesta(method : Metodi, url : string, parameters : object = {}) {
    const config : AxiosRequestConfig = {
      "baseURL": `https://localhost:${environment["SERVER_PORT"]}/`,
      "url":  url, 
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
  if(token) localStorage["token"] = token;
  return response;
});