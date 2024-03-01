import _fs from "fs";
import _http from "http";

const paginaErrore = new Promise<string>((resolve) => {
    _fs.readFile("./static/error.html", (err : NodeJS.ErrnoException | null, data : Buffer) => {
        if (err) 
        {
            resolve(`<h1>Risorsa non trovata</h1>`);
        }
        else resolve(data.toString());
    });
});

const ReadFileAsync = (path : string) => {
    return new Promise<string>((resolve, reject) => {
        _fs.readFile(path,{ encoding: 'utf8' }, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    })
}

const OggettoVuoto = (o : object) : boolean => !Object.keys(o).length;


const CorsAperto = (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => callback(null, true);
type TipoServer  = _http.Server<typeof _http.IncomingMessage, typeof _http.ServerResponse> 

export { paginaErrore, TipoServer, ReadFileAsync, OggettoVuoto, CorsAperto };