import _cloudinary, { UploadApiResponse } from "cloudinary";
import env from "./ambiente.js";

const Cloudinary = _cloudinary.v2;

Cloudinary.config({
    cloud_name: env["CLOUDINARY_CLOUD_NAME"],
    api_key: env["CLOUDINARY_API_KEY"],
    api_secret: env["CLOUDINARY_API_SECRET"]
})

const CaricaImmagine = (image: any) => {
    return new Promise<{errore: string} | UploadApiResponse>((resolve) => {
        Cloudinary.uploader.upload(image.path, (error: any, result: any) => {
            console.log(error, result)
            if(error) resolve({errore : "Errore nel caricamento dell'immagine"});
            resolve(result!);
        })  
    });
}

const DataInStringa = (data: Date) => {
    const giorno = data.getDate().toString().padStart(2, "0")
    const mese = (data.getMonth() + 1).toString().padStart(2, "0")
    const anno = data.getFullYear();
    const ora = data.getHours().toString().padStart(2, "0");
    const minuti = data.getMinutes().toString().padStart(2, "0");
    return `${giorno}/${mese}/${anno}-${ora}:${minuti}`
}

const StringaInData = (data: string) => {
    const [dataStr, ora] = data.split("-")
    const [giorno, mese, anno] = dataStr.split("/")
    const [ore, minuti] = ora.split(":")
    return new Date(parseInt(anno), parseInt(mese) - 1, parseInt(giorno), parseInt(ore), parseInt(minuti))
}

export { DataInStringa, StringaInData, CaricaImmagine}