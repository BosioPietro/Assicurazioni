import { Injectable } from '@angular/core';
import Utente from './tabella-utenti/utente.model';
import { GestoreServerService } from 'src/app/server/gestore-server.service';
import { Metodi } from 'src/app/utils/TipiSpeciali';
import { AxiosError } from 'axios';

@Injectable({
  providedIn: 'root'
})
export class TabellaService {

  constructor(private server: GestoreServerService) { }

  utenti: Utente[] = [];
  tutti: Utente[] = [];
  selezionati: Utente[] = [];

  public selezionatiTutti: boolean = false;

  public inCaricamento: boolean = true;
  public utentiNonTrovati: boolean = false;

  public utenteVisualizzato?: Utente;
  public utenteModificato?: Utente;

  private tipoDipendente: string = "Dipendente";
  private nomeDipendente: string = "";
  private ordineCrescente: boolean = true;
  private campoOrdinamento: keyof Utente = "nome";

  set tipo(t: string){
    this.tipoDipendente = t;
    this.selezionati = [];
    this.selezionatiTutti = false;

    this.utenti = this.tutti.filter(u => u.ruolo === this.tipoDipendente || this.tipoDipendente === "Tutti");
    this.FiltraNome();
    this.Ordina(this.ordineCrescente, this.campoOrdinamento);
  }

  set nome(n: string){
    this.nomeDipendente = n;
    this.selezionati = []
    this.selezionatiTutti = false;

    this.utenti = this.tutti.filter(u => u.nome.toLowerCase().includes(n.toLowerCase()) || !n);
    this.FiltraTipo();
    this.Ordina(this.ordineCrescente, this.campoOrdinamento);
  }

  private FiltraTipo(){
    this.utenti = this.utenti.filter(u => u.ruolo === this.tipoDipendente || this.tipoDipendente === "Tutti");
    this.utentiNonTrovati = this.utenti.length === 0 && !this.inCaricamento;
  }

  private FiltraNome(){
    this.utenti = this.utenti.filter(u => (u.nome + " " + u.cognome).toLowerCase().includes(this.nomeDipendente.toLowerCase()) || !this.nomeDipendente);
    this.utentiNonTrovati = this.utenti.length === 0 && !this.inCaricamento;
  }

  Ordina(crescente: boolean, campo: keyof Utente){
    this.ordineCrescente = crescente;
    this.campoOrdinamento = campo;

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

  PrendiUtenti(){
    return this.server.InviaRichiesta(Metodi.GET, "/api/utenti");
  }

  SelezionaUtente(u: Utente){
    this.selezionati.push(u);
  }

  DeselezionaUtente(u: Utente){
    this.selezionati = this.selezionati.filter(utente => utente !== u);
  }

  SelezionaTutti(){
    this.selezionati = this.utenti;
  }

  async Carica(){
    return new Promise<boolean>(async (resolve) => {

      this.inCaricamento = true;
      this.tutti = this.utenti = this.selezionati = [];
      
      let fallimento = false;
      let utenti = await this.PrendiUtenti().catch(() => {
        resolve(false);
        fallimento = true;
      }) as any;

      
      if(fallimento)return;
      utenti = utenti["data"].map((u: Record<string, any>) => Object.assign(u, { attivo: u["attivo"] == "true" }));

      this.inCaricamento = false;
      this.tutti = this.utenti = utenti.map((u: Record<string, any>) => {
        if(!("2FA" in u))
        {
          u["2FA"] = false; 
        }
        
        u["telefono"] = u["telefono"] || "";

        return u as Utente;
      })

      this.FiltraTipo();
      this.FiltraNome();
      this.Ordina(this.ordineCrescente, this.campoOrdinamento);
      resolve(true);
    });
  }

  async EliminaUtente(utente: Utente[]) {
    return new Promise<void | number>((resolve) => {
        const username = utente.map(u => u.username);
        this.server.InviaRichiesta(Metodi.DELETE, "/api/utenti", { utenti: username })
        .then(() => resolve())
        .catch((err: AxiosError) => resolve(err.status!));
    });
  }

  AggiungiUtente(u: Utente){
    return new Promise<void | number>((resolve) => {
      this.server.InviaRichiesta(Metodi.POST, "/api/utenti", u)
      .then(() => resolve())
      .catch((res: AxiosError) => resolve(res.status!));
    });
  }

  PrendiStatistiche(){
    return new Promise<Record<string, any> | undefined>((resolve) => {
      this.server.InviaRichiesta(Metodi.GET, "/api/statistiche-admin")
      .then((res) => resolve(res.data))
      .catch(() => resolve(undefined));
    });
  }

}