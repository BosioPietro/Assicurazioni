import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AsideComponentComponent } from './aside-component/voce-aside.component';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { animazione } from 'src/app/comuni/animazioni/appari-disappari';
import { IonIcon } from '@ionic/angular/standalone';
import { GestoreServerService } from 'src/app/server/gestore-server.service';
import { Metodi } from 'src/app/utils/TipiSpeciali';
import Utente from '../utenti/tabella-utenti/utente.model';
import { NotificheService } from 'src/app/comuni/notifiche/notifiche.service';
import { ImmagineProfiloDefault } from 'src/app/comuni/immagine-profilo-default/immagine-profilo-default.component';
import { ModaleSiNoComponent } from 'src/app/comuni/modale-si-no/modale-si-no.component';

@Component({
  selector: 'AsideComponent',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss'],
  imports: [AsideComponentComponent, MenuModule, IonIcon, ImmagineProfiloDefault, ModaleSiNoComponent],
  animations: [animazione],
  standalone: true
})
export class AsideComponent  implements OnInit{

  constructor(
    private server: GestoreServerService,
    private notifiche: NotificheService
  ) { }

  routerLink = ["/admin/home" ,"/admin/perizie", "/admin/utenti"]
  elencoVoci:any[] = ["Home", "Perizie","Utenti"]
  elencoIcons:any[] = ["home","map","people"]
  elencoNotifications:any[] = new Array(this.elencoVoci.length).fill(0)

  vuoleUscire = false;
  inCaricamento = false;

  window = window;

  @ViewChild("opzioni")
  wrapper!: ElementRef<HTMLElement>

  utente?: Utente
  async ngOnInit() {
    this.utente = await this.PrendiInfoUtente()

    if(!this.utente){
      this.notifiche.NuovaNotifica({
        titolo: "Errore",
        descrizione: "Errore nel caricamento delle informazioni utente",
        tipo: "errore"
      })
    }
  }

  RimuoviParametri(s: string){
    return s.split("?")[0];
  }

  opzioneLogout: MenuItem = {
    label: 'Logout',
    icon: 'pi pi-fw pi-sign-out',
    command: () => {
      this.vuoleUscire = true;
    }
  }

  Logout(){
    this.inCaricamento = true;

    setTimeout(() => {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }, 500);
  }

  PrendiInfoUtente(){
    return new Promise<Utente | undefined>((resolve, reject) => {
      this.server.InviaRichiesta(Metodi.GET, "/api/info-utente")
      .then((res: any) => resolve(res["data"] as Utente))
      .catch((err: any) => reject(undefined))
    })
  }

  
  ChiudiElimina(dialogo: ModaleSiNoComponent){
    const modale = dialogo.modale.nativeElement;

    modale.classList.add("chiudi");
    setTimeout(() => {
      modale.close()
      modale.classList.remove("chiudi");
      this.vuoleUscire = false;
    }, 301);
  }

}
