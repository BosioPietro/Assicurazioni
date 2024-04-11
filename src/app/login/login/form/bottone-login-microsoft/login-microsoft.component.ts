import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'LoginMicrosoft',
  standalone: true,
  templateUrl: './login-microsoft.component.html',
  styleUrls: ['./login-microsoft.component.scss'],
})
export class LoginMicrosoftComponent {

  @Output() 
  loginWithMicrosoft: EventEmitter<any> = new EventEmitter<any>();

  Login() {
    this.loginWithMicrosoft.emit();
  }
}
