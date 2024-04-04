import { Routes } from '@angular/router';
import { SpotifyService } from './services/spotify.service';
import path from 'path';

export const routes: Routes = [
    {
        path: 'Linx',
        children: 
        [
            {
                path : 'Inicio',
                loadComponent : () => import('./components/meetingzone/mainComponents/mainpanel.component').then(c => c.MainpanelComponent)
            },
            {
                path: 'Registro',
                loadComponent : ()=> import('./components/accountarea/signupComponent/signupuserprof/signup-userdata.component').then(c => c.SignupUserdataComponent)
                
            },
            {
                path:'SignedUp',
                loadComponent : () => import('./components/accountarea/signupComponent/signedupOK/signedup-ok.component').then(c => c.SignedupOKComponent)
            },
            {
                path : 'Musica',
                loadComponent : ()=> import('./components/mediazone/musicComponents/music/mymusic.component').then(m=> m.MymusicComponent)
            },
            {
                path : 'Login',
                loadComponent : () => import('./components/accountarea/signinComponent/signin.component').then(m=> m.SigninComponent)
            },
            {
                path: 'Home',
                loadComponent : () => import('./components/home/userhome/userhome.component').then(m=>m.UserhomeComponent)
            }
        ]
    
    }
];
