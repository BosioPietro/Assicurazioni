import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { animazione } from 'src/app/comuni/animazioni/appari-disappari';
import { ImmagineProfiloDefault } from 'src/app/comuni/immagine-profilo-default/immagine-profilo-default.component';
import { ModaleSiNoComponent } from 'src/app/comuni/modale-si-no/modale-si-no.component';
import Utente from '../utenti/tabella-utenti/utente.model';
import { AsideComponentComponent } from './aside-component/voce-aside.component';
import { AdminService } from '../admin.service';

@Component({
  selector: 'AsideComponent',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss'],
  imports: [AsideComponentComponent, MenuModule, IonIcon, ImmagineProfiloDefault, ModaleSiNoComponent],
  animations: [animazione],
  standalone: true
})
export class AsideComponent{

  constructor(public admin: AdminService) { }

  routerLink = ["/admin/home" ,"/admin/perizie", "/admin/utenti"]
  elencoVoci:any[] = ["Home", "Perizie","Utenti"]
  elencoIcons:any[] = ["home","map","people"]
  elencoNotifications:any[] = new Array(this.elencoVoci.length).fill(0)

  vuoleUscire = false;
  inCaricamento = false;

  window = window;

  @ViewChild("opzioni")
  wrapper!: ElementRef<HTMLElement>

  RimuoviParametri(s: string){
    const p = s.split("?")[0].split("/");
    if(p.length > 3) p.pop();
    return p.join("/");
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
