import { Component, OnInit } from '@angular/core';
import {IonIcon} from "@ionic/angular/standalone";
import { RadioButtonComponent } from 'src/app/components/radio-button/radio-button.component';
import { SelectComponent } from 'src/app/components/select/select.component';
import { SelectionComponent } from 'src/app/components/selection/selection.component';
import { MapService } from '../shared/map.service';
import { UtilityService } from '../shared/utility.service';
import { NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import Utente from '../../utenti/tabella-utenti/utente.model';
import { NotificheService } from 'src/app/comuni/notifiche/notifiche.service';
import Opzione from 'src/app/comuni/elementi-form/dropdown/opzione.model';
import { DropdownComponent } from 'src/app/comuni/elementi-form/dropdown/dropdown.component';

@Component({
  selector: 'Filtri',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.scss'],
  imports: [IonIcon, SelectComponent, RadioButtonComponent, SelectionComponent, 
            NgStyle, FormsModule, CalendarModule, DropdownComponent],
  standalone: true
})
export class FiltroComponent  implements OnInit {
  rangeDates!:Date[];
  month = "Gennaio";
  day = "01";
  year = "2024";
  operatori?: Opzione[];

  constructor(
    public mapService:MapService, 
    public utilityService:UtilityService,
    public notifiche: NotificheService
  ) { }

  async ngOnInit() {
    const aus = await this.mapService.PrendiUtenti();

    if(!aus){
      this.notifiche.NuovaNotifica({
        tipo: "errore",
        titolo: "Qualcosa è andato storto",
        descrizione: "Non è stato possibile caricare gli operatori"
      })
      return;
    }

    this.operatori = aus.map((utente: Utente) => ({
      valore: utente["username"],
      testo: `${utente["cognome"]} ${utente["nome"]}`
    }));

    this.operatori.unshift({
      valore: "tutti",
      testo: "Tutti"
    
    })
  }

  datePicked(){
    this.mapService.pickedDates = Array.isArray(this.rangeDates) ? this.rangeDates : [this.rangeDates];
    console.log(this.mapService.pickedDates);
    console.log(this.rangeDates);
    // this.mapService.creaMappa();
    if(this.rangeDates.length == 2){
      
    }else{

    }
  }

  onSelectionRemoved(selection:any){
    this.mapService.selectedOperators.splice(this.mapService.selectedOperators.indexOf(selection), 1);
    this.utilityService.elencoOperatori.push(selection);
  }
  onOptionClicked(option:any){
    this.mapService.selectedOperators.push(option);
    this.utilityService.elencoOperatori.splice(this.utilityService.elencoOperatori.indexOf(option), 1);
    // this.mapService.creaMappa();
  }
  onMonthClicked(month:any){
    this.utilityService.elencoGiorni = [];
    console.log(this.utilityService.elencoGiorni.length);
    for(let i = 1; i <= this.utilityService.elencoNGiorni[this.utilityService.elencoMesi.indexOf(month)];i++){
      if(i < 10){
        this.utilityService.elencoGiorni.push('0' + i.toString());
      }else{
        this.utilityService.elencoGiorni.push(i.toString());
      }
    }
    this.day = "01";
  }
}
