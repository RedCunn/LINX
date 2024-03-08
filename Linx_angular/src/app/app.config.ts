import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import {routes} from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SpotifyService } from './services/spotify.service';

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withFetch()),
              provideRouter(routes), 
              provideClientHydration()]
};
