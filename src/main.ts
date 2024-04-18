import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from 'src/environments/environment';
import { GoogleLoginProvider, MicrosoftLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { provideAnimations } from '@angular/platform-browser/animations';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    BrowserAnimationsModule,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideAnimations(),
    provideRouter(routes),
    {
      provide: "SocialAuthServiceConfig",
      useValue: {
        autoLogin: false,
        providers: [
            {
              id: GoogleLoginProvider.PROVIDER_ID,
              provider: new GoogleLoginProvider(environment.GOOGLE_CLIENT_ID, { oneTapEnabled: false })
            },
            {
              id: MicrosoftLoginProvider.PROVIDER_ID,
              provider: new MicrosoftLoginProvider(environment.MICROSOFT_CLIENT_ID, {
                authority: `https://login.microsoftonline.com/consumers`,
                redirect_uri: "http://localhost:8100/home",
              })
            }
        ],
        onError: (err) => {
          console.error(err);
        },
      } as SocialAuthServiceConfig,
    },
  ],
});
