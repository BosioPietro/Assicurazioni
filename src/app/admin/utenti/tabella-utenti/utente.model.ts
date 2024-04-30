type Utente = {
    nome: string,
    cognome: string,
    username: string,
    pfp: string,
    ruolo: "Admin" | "Dipendente",
    nPerizie: number,
    assuntoIl: string,
    email: string,
    "2FA": boolean,
    attivo: boolean,
    telefono: string,
    genere: "M" | "F",
}

export default Utente;