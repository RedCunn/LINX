import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'Inicio',
        loadComponent : ()=> import('./components/mediazone/musicComponents/music/mymusic.component').then(m=> m.MymusicComponent)
    }
];
