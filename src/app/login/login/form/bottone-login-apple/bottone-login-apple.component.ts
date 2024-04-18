import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'LoginApple',
  templateUrl: './bottone-login-apple.component.html',
  styleUrls: ['./bottone-login-apple.component.scss'],
  standalone: true
})
export class BottoneLoginAppleComponent {

  @Output()
  loginWithApple = new EventEmitter<void>();

  Login(){
    this.loginWithApple.emit();  
  }

}
