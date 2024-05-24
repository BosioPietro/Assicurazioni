import { Component, Output, EventEmitter } from '@angular/core';

declare global {
  interface Window {
    google: any;
  }
}

@Component({
  selector: 'LoginGoogle',
  standalone: true,
  templateUrl: './login-google.component.html',
  styleUrls: ['./login-google.component.scss'],
})
export class LoginGoogleComponent {

    @Output() 
    loginWithGoogle: EventEmitter<any> = new EventEmitter<any>();

    handleGoogleLogin() {
      this.loginWithGoogle.emit(this.createFakeGoogleWrapper());
    }

    createFakeGoogleWrapper = () => {
      const googleLoginWrapper = document.createElement('div');
      googleLoginWrapper.style.display = 'none';
      googleLoginWrapper.classList.add('custom-google-button');
      document.body.appendChild(googleLoginWrapper);
      window.google.accounts.id.renderButton(googleLoginWrapper, {
        type: "standard",
        width: 200,
      });
    
      const googleLoginWrapperButton = googleLoginWrapper.querySelector(
        'div[role=button]'
      ) as HTMLElement;
    
      return {
        click: () => {
          googleLoginWrapperButton?.click();
        },
      };
    };

}
