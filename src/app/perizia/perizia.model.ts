type Immagine = {
    url: string,
    commento: string
}

type Perizia = {
    _id: number,
    immagini: Immagine[],
    luogo: {
        provincia: string,
        citta: string,
        indirizzo: string,    
        coordinate: {
            lat: number,
            lng: number
        }
    },
    codice: number,
    codOperatore: string,
    nomeOperatore?: string,
    data: string,
    completata?: boolean,
}

export { Perizia, Immagine };