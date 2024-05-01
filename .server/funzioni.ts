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
    return `${anno}-${mese}-${giorno}`
}

const StringaInData = (data: string) => {
    const [anno, mese, giorno] = data.split("-")
    console.log(data)
    return new Date(parseInt(anno), parseInt(mese) - 1, parseInt(giorno))
}

export { DataInStringa, StringaInData, CaricaImmagine}