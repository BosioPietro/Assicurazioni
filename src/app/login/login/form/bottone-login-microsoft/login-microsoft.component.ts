import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'LoginMicrosoft',
  templateUrl: './login-microsoft.component.html',
  styleUrls: ['./login-microsoft.component.scss'],
  standalone: true,
})
export class LoginMicrosoftComponent {

  @Output() 
  loginWithMicrosoft: EventEmitter<any> = new EventEmitter<any>();

  Login() {
    this.loginWithMicrosoft.emit()
  }
}
