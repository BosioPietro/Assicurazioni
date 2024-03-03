import { AxiosResponse } from "axios";
import { GestoreServerService } from "../server/gestore-server.service"
import { Metodi } from "./TipiSpeciali";

const server = new GestoreServerService();

const ControllaToken = () : Promise<AxiosResponse> => server.InviaRichiesta(Metodi.GET, "/api/controllo-token")

export { ControllaToken }