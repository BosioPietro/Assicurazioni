

export enum Metodi {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE",
}

export type Nullabile<T> = T | null;

export type Notifica = {
    titolo: string,
    descrizione: string,
    tipo: "info" | "warning" | "errore",
    icona?: string
}
