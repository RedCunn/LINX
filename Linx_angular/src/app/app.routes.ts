import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'Linx',
        children: 
        [
            {
                path:'error',
                loadComponent: () => import('./components/error/errorpage.component').then(c=>c.ErrorpageComponent)
            },
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
                path : 'Buscaraudio',
                loadComponent : ()=> import('./components/mediazone/musicComponents/searchaudio/mymusic.component').then(m=> m.MymusicComponent)
            },
            {
                path : 'Login',
                loadComponent : () => import('./components/accountarea/signinComponent/signin.component').then(m=> m.SigninComponent)
            },
            {
                path: 'Home',
                loadComponent : () => import('./components/home/userhome/userhome.component').then(m=>m.UserhomeComponent),
            },
            {
                path:'Home/Profile',
                loadComponent : () => import('./components/home/userprofile/userprofile.component').then(m=>m.UserprofileComponent)
            },
            {
                path: 'Events',
                loadComponent : () => import('./components/home/eventscomponents/eventspanel/eventspanel.component').then(m=> m.EventspanelComponent)
            },
            {
                path: 'BuscarEvento',
                loadComponent : () => import('./components/home/eventscomponents/searchevents/searchevents.component').then(m=> m.SearcheventsComponent)
            },
            {
                path: 'CrearEvento',
                loadComponent : () => import('./components/home/eventscomponents/createevent/createevent.component').then(m=> m.CreateeventComponent)
            },
            {
                path: 'Exchange',
                loadComponent : ()=> import('./components/home/exchangecomponents/exchangepanel/exchangepanel.component').then(m => m.ExchangepanelComponent)
            },
            {
                path : 'BuscarIntercambio',
                loadComponent : ()=> import('./components/home/exchangecomponents/searchexchange/searchexchange.component').then(m=> m.SearchexchangeComponent)
            },
            {
                path : 'CrearItem',
                loadComponent : ()=> import('./components/home/exchangecomponents/createexitem/createexitem.component').then(m=> m.CreateexitemComponent)
            },
            {
                path: 'Podcastslib',
                loadComponent : () => import ('./components/mediazone/musicComponents/podcastslib/podcastslib.component').then(m=>m.PodcastslibComponent)
            },
            {
                path: 'Trackslib',
                loadComponent : () => import ('./components/mediazone/musicComponents/trackslib/trackslib.component').then(m=>m.TrackslibComponent)
            },
            {
                path: 'Albumslib',
                loadComponent : () => import ('./components/mediazone/musicComponents/albumslib/albumslib.component').then(m=>m.AlbumslibComponent)
            },
            {
                path: 'Artistslib',
                loadComponent : () => import ('./components/mediazone/musicComponents/artistslib/artistslib.component').then(m=>m.ArtistslibComponent)
            }
        ]
    
    },
    {
        path:'',
        redirectTo:'Linx/Login',
        pathMatch:'full'
    }
];
