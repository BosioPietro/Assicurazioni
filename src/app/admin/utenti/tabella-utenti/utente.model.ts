type Utente = {
    nome: string,
    cognome: string,
    username: string,
    pfp: string,
    ruolo: "Admin" | "Dipendente",
    nPerizie: number,
    stato: "Attivo" | "Non attivo",
    assuntoIl: string,
}

export default Utente;