import { Router } from "@angular/router";
import { GestoreServerService } from "../server/gestore-server.service"
import { Metodi } from "./TipiSpeciali";

const server = new GestoreServerService();

const UrlPagina = () : string => {
    let url = window.location.href.replace(/https?:\/\//, "");
    const i = url.indexOf("?")
    if(i != -1){
        url = url.split("?")[0]
    }
    return url.split("/").slice(1).join("/"); 
}

const GiorniMancanti = (creazione : string) => {
    const GIORNI_CAMBIO_PWD = 7;
    const oggi = new Date();
    oggi.setHours(0, 0, 0, 0)

    const scadenza = AggiungiGiorni(PrendiData(creazione), GIORNI_CAMBIO_PWD)

    return SottraiGiorni(scadenza, oggi)
}

const AggiungiGiorni = (data: Date, giorni: number) => {
    const nuova = new Date(data.getTime());
    const giorno = data.getDate();

    nuova.setDate(giorno + giorni);
  
    return nuova;
}

const SottraiGiorni = (data1: Date, data2: Date) => {
    const inizio = new Date(data1);
    const fine = new Date(data2);
  
    const differenzaTempo = fine.getTime() - inizio.getTime();  
    const differenzaGiorni = Math.floor(differenzaTempo / (1000 * 60 * 60 * 24));
  
    return differenzaGiorni;
}
  

const PrendiData = (dateString: string) => {
    const [giorno, mese, anno] = dateString.split("-");
    return new Date(+anno, +mese - 1, +giorno, 0, 0, 0, 0);
}
  
const DataInStringa = (data: Date) => {
    const giorno = data.getDate().toString().padStart(2, "0")
    const mese = (data.getMonth() + 1).toString().padStart(2, "0")
    const anno = data.getFullYear();
    const ora = data.getHours().toString().padStart(2, "0");
    const minuti = data.getMinutes().toString().padStart(2, "0");
    return `${giorno}/${mese}/${anno}-${ora}:${minuti}`
}

const FormattaData = (data: Date | string) => {
    if(typeof data == "string")
    {
        data = StringaInData(data);
    }
    return data.toLocaleDateString("IT-it", {day: "2-digit", month: "long", year: "numeric"})
}

const StringaInData = (data: string) => {
    const [anno, mese, giorno] = data.split("-").map(Number);
    return new Date(anno, mese - 1, giorno);
}

const RimuoviParametri = (route: string) => {
    const i = route.indexOf("?")
    return i == -1 ? route :  route.slice(0, i)
}

const ControllaToken = async (r : Router) : Promise<any> => {
    
    const pagina = UrlPagina();
    let info : any = await server.InviaRichiesta(Metodi.GET, "/api/controllo-token").catch(() => null)

    // token non presente
    if(!info) return r.navigate(["/login"])
    info = info["data"];
    // casi particolari
    switch(pagina)
    {
        case "login/cambio-password":
            if(!info["deveCambiare"])
            {
                r.navigate(["/login"]);
            }
            info["giorniMancanti"] = GiorniMancanti(info["dataCreazione"]);
        break;
        case "login/verifica":
            if(!("2FA" in info))
            {
                r.navigate(["/login"]);
            }
            break;
        default:
            if(!DeveCambiare(info, r))
            {
                Loggato2Fattori(info, r);   
            }
        break
    }

    return info;
} 

const Loggato2Fattori = (info: Record<string, any>, r: Router) => {
    if("2FA" in info && !info["2FA"])
    {
        r.navigate(["/login/verifica"])   
    }
}

const DeveCambiare = (info: Record<string, any>, r: Router) => {
    const deveCambiare = info["deveCambiare"]
    if(!deveCambiare)return;

    const giorniRimanenti = GiorniMancanti(info["dataCreazione"]); 
    if(giorniRimanenti <= 0)
    {
        r.navigate(["/login/cambio-password"])
        return true;
    }
    return false;
}

const RemInPx = (val: string) => {
    const rem = parseFloat(val);
    const px = rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
    return px;
}


export { ControllaToken, RimuoviParametri, RemInPx, DataInStringa, FormattaData, StringaInData }