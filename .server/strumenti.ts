import _fs from "fs";
import _http from "http";
import { Response } from "express";

const ReadFileAsync = (path : string) => {
    return new Promise<string>((resolve, reject) => {
        _fs.readFile(path,{ encoding: 'utf8' }, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    })
}

const OggettoVuoto = (o : object) : boolean => !Object.keys(o).length;

type TipoServer  = _http.Server<typeof _http.IncomingMessage, typeof _http.ServerResponse> 

const RispondiToken = (res : Response, token : string, messaggio : object) => {
    res.setHeader("authorization", token);
    res.setHeader("access-control-expose-headers", "authorization");
    res.send(messaggio);
}

export { TipoServer, ReadFileAsync, OggettoVuoto, RispondiToken };