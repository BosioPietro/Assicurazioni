type Immagine = {
    url: string,
    commento: string
}

type Perizia = {
    id: number,
    coordinate: {
        lat: number,
        lng: number
    },
    immagini: Immagine[],
    luogo: {
        provincia: string,
        citta: string,
        indirizzo: string,
    },
    codice: number,
    codOperatore: string,
    nomeOperatore?: string,
    data: string,
    completata?: boolean,
}

export { Perizia, Immagine };