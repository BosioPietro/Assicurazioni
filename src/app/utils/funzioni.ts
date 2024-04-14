import { Router } from "@angular/router";
import { GestoreServerService } from "../server/gestore-server.service"
import { Metodi } from "./TipiSpeciali";
import moment from "moment";

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
    const oggi = moment().startOf("day");
    const scadenza = moment(creazione, "DD-MM-YYYY").startOf("day").add(GIORNI_CAMBIO_PWD, "days")

    return scadenza.diff(oggi, "days")
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



export { ControllaToken, RimuoviParametri }