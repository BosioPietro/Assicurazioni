import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { PeriziaService } from './perizia.service';
import { Perizia } from './perizia.model';
import { GoogleMap, MapAdvancedMarker, MapMarker } from '@angular/google-maps';
import { CaroselloComponent } from './carosello/carosello.component';
import { ControllaToken, FormattaData, StringaInData } from '../utils/funzioni';
import { NotificheService } from '../comuni/notifiche/notifiche.service';
import { DialogoImmaginiComponent } from './dialogo-immagini/dialogo-immagini.component';
import { ModaleSiNoComponent } from '../comuni/modale-si-no/modale-si-no.component';
import { ModificaPeriziaComponent } from './modifica-perizia-modale/modifica-perizia-modale.component';

@Component({
  selector: 'app-perizia',
  templateUrl: './perizia.page.html',
  styleUrls: ['./perizia.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, GoogleMap, MapMarker, 
            MapAdvancedMarker, CaroselloComponent, DialogoImmaginiComponent,
            ModaleSiNoComponent, ModificaPeriziaComponent]
})
export class PeriziaPage implements OnInit, AfterViewInit {

  @ViewChild("immagini")
  dialogoImmagini!: DialogoImmaginiComponent;

  constructor(
    private route: ActivatedRoute,
    private periziaService: PeriziaService,
    private notifiche: NotificheService,
    private router: Router
  ) { }

  maps = window.google.maps;

  perizia?: Perizia;
  mostraHtml: boolean = false;

  opzioni: any = {}
  FormattaData = FormattaData;

  visualizzaImmagini: boolean = false;

  vuoleEliminare: boolean = false;
  inCaricamentoElimina: boolean = false;

  ngAfterViewInit(): void {
    this.mostraHtml = true;
  }

  async ngOnInit() {
    ControllaToken(this.router);
    const { PinElement } = await this.maps.importLibrary("marker") as google.maps.MarkerLibrary;
    
    this.opzioni = new PinElement({
      "background": "#245c73",
      "borderColor": "#f2f3f5",
      "glyphColor": "#f2f3f5",
      "scale": 1.2,
    })

    const idPerizia = this.route.snapshot.paramMap.get('codice')!;
    this.perizia = await this.periziaService.PrendiPerizia(idPerizia);

    if(!this.perizia){
      console.error("Perizia non trovata");
      return;
    }

    this.periziaService.PrendiOperatore(this.perizia!.codOperatore)
    .then((o) => this.perizia!.nomeOperatore = o)
    .catch(() =>{
        this.notifiche.NuovaNotifica({
          titolo: "Qualcosa è andato storto",
          descrizione: "Non è stato possibile recuperare i dati dell'operatore",
          tipo: "errore",
        })
    })
  }

  StampaStato(){
    const oggi = new Date();
    const data = StringaInData(this.perizia!.data);
    const giorni = Math.floor((oggi.getTime() - data.getTime()) / (1000 * 3600 * 24));

    if(this.perizia!.completata)
    {
      return "Completata";
    }
    else if(giorni == 0)
    {
      return "In Scadenza";
    }
    else return "In Programma"
  }

  ChiudiImmagini(){
    const modale = this.dialogoImmagini.modale.nativeElement;

    modale.classList.add("chiudi");
    setTimeout(() => {
      modale.close()
      modale.classList.remove("chiudi");
      this.visualizzaImmagini = false;
    }, 301);
  }

  ChiudiElimina(dialogo: ModaleSiNoComponent){
    const modale = dialogo.modale.nativeElement;

    modale.classList.add("chiudi");
    setTimeout(() => {
      modale.close()
      modale.classList.remove("chiudi");
      this.vuoleEliminare = false;
    }, 301);
  }

  EliminaPerizia(){
    this.inCaricamentoElimina = true;

    this.periziaService.EliminaPerizia(this.perizia!.codice)
    .then(() => {
      this.inCaricamentoElimina = false;
      this.notifiche.NuovaNotifica({
        titolo: "Perizia eliminata",
        descrizione: "La perizia è stata eliminata con successo",
        tipo: "info"
      })
      this.router.navigate(["/home"]);

    })
      .catch(() => {
        this.inCaricamentoElimina = false;
        this.notifiche.NuovaNotifica({
          titolo: "Errore",
          descrizione: "Non è stato possibile eliminare la perizia",
          tipo: "errore"
        })
      })
  }

  periziaVisualizzata?: Perizia;
  periziaModicata?: Perizia;

  ApriModifica(){
    this.periziaVisualizzata = this.perizia!;
    this.periziaModicata = structuredClone(this.perizia!);
  }

}
