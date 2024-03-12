import { Routes } from '@angular/router';
import { SpotifyService } from './services/spotify.service';
import { MY_SPOTIFYSERVICES_TOKEN } from './services/injectionToken';
import path from 'path';

export const routes: Routes = [
    {
        path: 'Linx',
        children: 
        [
            {
                path : 'Inicio',
                loadComponent : ()=> import('./components/mediazone/musicComponents/music/mymusic.component').then(m=> m.MymusicComponent)
            },
            {
                path: 'Registro',
                loadComponent : ()=> import('./components/accountarea/signupComponent/signupFilters.component').then(c => c.SignupComponent)
            }
        ]
    
    }
];
