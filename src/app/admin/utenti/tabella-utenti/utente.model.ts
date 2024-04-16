type Utente = {
    nome: string,
    cognome: string,
    handle: string,
    pfp: string,
    ruolo: "Admin" | "Dipendente",
    nPerizie: number,
    stato: "Attivo" | "Non attivo",
    assuntoIl: string,
}

export default Utente;