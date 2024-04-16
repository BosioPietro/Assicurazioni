import { Injectable } from '@angular/core';
import Utente from './tabella-utenti/utente.model';

@Injectable({
  providedIn: 'root'
})
export class TabellaService {

  utenti: Utente[] = utenti;
  private tipoDipendente: string = "Dipendente";
  private nomeDipendente: string = "";

  set tipo(t: string){
    this.tipoDipendente = t;

    this.utenti = utenti.filter(u => u.ruolo === this.tipoDipendente || this.tipoDipendente === "Tutti");
    this.FiltraNome();
  }

  set nome(n: string){
    this.nomeDipendente = n;

    this.utenti = utenti.filter(u => u.nome.toLowerCase().includes(n.toLowerCase()) || !n);
    this.FiltraTipo();
  }

  FiltraTipo(){
    this.utenti = this.utenti.filter(u => u.ruolo === this.tipoDipendente || this.tipoDipendente === "Tutti");
  }

  FiltraNome(){
    this.utenti = this.utenti.filter(u => u.nome.toLowerCase().includes(this.nomeDipendente.toLowerCase()) || !this.nomeDipendente);
  }

  Ordina(crescente: boolean, campo: keyof Utente){
    if(campo === "assuntoIl"){
      this.utenti.sort((a, b) => {
        return (crescente ? 1 : -1) * (new Date(a[campo]).getTime() - new Date(b[campo]).getTime());
      });
      return;
    }
    this.utenti.sort((a, b) => {
      return (crescente ? 1 : -1) * (a[campo] > b[campo] ? 1 : -1);
    });
  }
}


const utenti: Utente[] = [
  {
    "nome": "Marco",
    "cognome": "Rossi",
    "handle": "@marco_rossi",
    "pfp": "url_immagine",
    "ruolo": "Admin",
    "nPerizie": 5,
    "stato": "Attivo",
    "assuntoIl": "2022-04-01"
  },
  {
    "nome": "Giulia",
    "cognome": "Bianchi",
    "handle": "@giulia_bianchi",
    "pfp": "url_immagine",
    "ruolo": "Dipendente",
    "nPerizie": 3,
    "stato": "Attivo",
    "assuntoIl": "2023-01-15"
  },
  {
    "nome": "Paolo",
    "cognome": "Verdi",
    "handle": "@paolo_verdi",
    "pfp": "url_immagine",
    "ruolo": "Admin",
    "nPerizie": 8,
    "stato": "Non attivo",
    "assuntoIl": "2020-09-20"
  },
  {
    "nome": "Francesca",
    "cognome": "Russo",
    "handle": "@francesca_russo",
    "pfp": "url_immagine",
    "ruolo": "Dipendente",
    "nPerizie": 6,
    "stato": "Attivo",
    "assuntoIl": "2021-11-10"
  },
  {
    "nome": "Luca",
    "cognome": "Ferrari",
    "handle": "@luca_ferrari",
    "pfp": "url_immagine",
    "ruolo": "Admin",
    "nPerizie": 4,
    "stato": "Attivo",
    "assuntoIl": "2023-05-02"
  },
  {
    "nome": "Alessia",
    "cognome": "Martini",
    "handle": "@alessia_martini",
    "pfp": "url_immagine",
    "ruolo": "Dipendente",
    "nPerizie": 7,
    "stato": "Attivo",
    "assuntoIl": "2022-08-18"
  },
  {
    "nome": "Giorgio",
    "cognome": "Gallo",
    "handle": "@giorgio_gallo",
    "pfp": "url_immagine",
    "ruolo": "Admin",
    "nPerizie": 9,
    "stato": "Non attivo",
    "assuntoIl": "2019-12-05"
  },
  {
    "nome": "Elena",
    "cognome": "Conti",
    "handle": "@elena_conti",
    "pfp": "url_immagine",
    "ruolo": "Dipendente",
    "nPerizie": 2,
    "stato": "Non attivo",
    "assuntoIl": "2020-03-30"
  },
  {
    "nome": "Andrea",
    "cognome": "Mancini",
    "handle": "@andrea_mancini",
    "pfp": "url_immagine",
    "ruolo": "Admin",
    "nPerizie": 6,
    "stato": "Attivo",
    "assuntoIl": "2023-10-12"
  },
  {
    "nome": "Sara",
    "cognome": "Greco",
    "handle": "@sara_greco",
    "pfp": "url_immagine",
    "ruolo": "Dipendente",
    "nPerizie": 3,
    "stato": "Attivo",
    "assuntoIl": "2021-02-25"
  },
  {
    "nome": "Davide",
    "cognome": "Sanna",
    "handle": "@davide_sanna",
    "pfp": "url_immagine",
    "ruolo": "Admin",
    "nPerizie": 7,
    "stato": "Attivo",
    "assuntoIl": "2022-06-08"
  },
  {
    "nome": "Valentina",
    "cognome": "Piras",
    "handle": "@valentina_piras",
    "pfp": "url_immagine",
    "ruolo": "Dipendente",
    "nPerizie": 4,
    "stato": "Attivo",
    "assuntoIl": "2021-09-14"
  },
  {
    "nome": "Roberto",
    "cognome": "De Luca",
    "handle": "@roberto_deluca",
    "pfp": "url_immagine",
    "ruolo": "Admin",
    "nPerizie": 5,
    "stato": "Attivo",
    "assuntoIl": "2020-04-20"
  },
  {
    "nome": "Simona",
    "cognome": "Marino",
    "handle": "@simona_marino",
    "pfp": "url_immagine",
    "ruolo": "Dipendente",
    "nPerizie": 6,
    "stato": "Non attivo",
    "assuntoIl": "2022-01-30"
  },
  {
    "nome": "Massimo",
    "cognome": "Moretti",
    "handle": "@massimo_moretti",
    "pfp": "url_immagine",
    "ruolo": "Admin",
    "nPerizie": 8,
    "stato": "Non attivo",
    "assuntoIl": "2019-08-10"
  },
  {
    "nome": "Laura",
    "cognome": "Barbieri",
    "handle": "@laura_barbieri",
    "pfp": "url_immagine",
    "ruolo": "Dipendente",
    "nPerizie": 3,
    "stato": "Attivo",
    "assuntoIl": "2021-07-05"
  },
  {
    "nome": "Fabio",
    "cognome": "Caruso",
    "handle": "@fabio_caruso",
    "pfp": "url_immagine",
    "ruolo": "Admin",
    "nPerizie": 9,
    "stato": "Attivo",
    "assuntoIl": "2023-03-18"
  },
  {
    "nome": "Silvia",
    "cognome": "Ricci",
    "handle": "@silvia_ricci",
    "pfp": "url_immagine",
    "ruolo": "Dipendente",
    "nPerizie": 5,
    "stato": "Attivo",
    "assuntoIl": "2020-12-12"
  },
  {
    "nome": "Riccardo",
    "cognome": "Galli",
    "handle": "@riccardo_galli",
    "pfp": "url_immagine",
    "ruolo": "Admin",
    "nPerizie": 7,
    "stato": "Non attivo",
    "assuntoIl": "2021-04-25"
  },
  {
    "nome": "Chiara",
    "cognome": "Gatti",
    "handle": "@chiara_gatti",
    "pfp": "url_immagine",
    "ruolo": "Dipendente",
    "nPerizie": 4,
    "stato": "Attivo",
    "assuntoIl": "2022-09-08"
  }
]
