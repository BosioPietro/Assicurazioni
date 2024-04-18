import { Injectable } from '@angular/core';
import Utente from './tabella-utenti/utente.model';
import { GestoreServerService } from 'src/app/server/gestore-server.service';
import { Metodi } from 'src/app/utils/TipiSpeciali';

@Injectable({
  providedIn: 'root'
})
export class TabellaService {

  constructor(private server: GestoreServerService) { }

  utenti: Utente[] = [];
  tutti: Utente[] = [];
  selezionati: Utente[] = [];

  public opzioniMenu = [
    {
        label: 'Elimina',
        icon: 'pi pi-fw pi-trash'
    },
  ];

  public selezionatiTutti: boolean = false;

  public inCaricamento: boolean = true;
  public utentiNonTrovati: boolean = false;

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
    this.CambiaOpzioni()
  }

  DeselezionaUtente(u: Utente){
    this.selezionati = this.selezionati.filter(utente => utente !== u);
    this.CambiaOpzioni()
  }

  SelezionaTutti(){
    this.selezionati = this.utenti;
    this.CambiaOpzioni()
  }

  CambiaOpzioni(){
    if(this.selezionati.length > 1)
    {
      this.opzioniMenu = [
        {
          label: 'Elimina',
          icon: 'pi pi-fw pi-trash'
        },
        {
          label: 'Crea Gruppo',
          icon: 'pi pi-fw pi-users'
        }]
      return;
    }
  
    this.opzioniMenu = [
      {
        label: 'Elimina',
        icon: 'pi pi-fw pi-trash'
      },
      {
        label: 'Crea Chat',
        icon: 'pi pi-fw pi-comment'
      }]
  }
}