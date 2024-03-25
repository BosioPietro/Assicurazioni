import { Router } from "@angular/router";
import { GestoreServerService } from "../server/gestore-server.service"
import { Metodi } from "./TipiSpeciali";
import moment, { Moment } from "moment";

const server = new GestoreServerService();

const UrlPagina = () : string => {
    const url = window.location.href.replace(/https?:\/\//, "");
    return url.split("/").slice(1).join("/"); 
}

const GiorniMancanti = (creazione : string) => {
    const GIORNI_CAMBIO_PWD = 7;
    const oggi = moment().startOf("day");
    const scadenza = moment(creazione, "DD-MM-YYYY").startOf("day").add(GIORNI_CAMBIO_PWD, "days")

    return scadenza.diff(oggi, "days")
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
        case "cambio-password":
            if(!info["deveCambiare"])
            {
                r.navigate(["/home"]);
            }
            info["giorniMancanti"] = GiorniMancanti(info["dataCreazione"]);
        break;
        default:
            const deveCambiare = info["deveCambiare"]
            if(!deveCambiare)break;

            const giorniRimanenti = GiorniMancanti(info["dataCreazione"]); 
            if(giorniRimanenti <= 0)
            {
                r.navigate(["/cambio-password"])
            }
        break
    }

    return info;
} 



export { ControllaToken }