import { Component, OnInit, Renderer2, Signal, computed, inject, signal } from '@angular/core';
import { Event, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { SignalStorageService } from '../../../services/signal-storage.service';
import { IUser } from '../../../models/userprofile/IUser';

@Component({
  selector: 'app-mainheader',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './mainheader.component.html',
  styleUrl: './mainheader.component.css'
})
export class MainheaderComponent{

  private signalStoreSvc : SignalStorageService = inject(SignalStorageService);
  public isLogged! : Signal<boolean> ;

  public routePattern : RegExp = new RegExp("/Linx/Inicio", "g");
  public switchHome : RegExp = new RegExp("/Linx/Home", "g");
  public rotatelogo = signal(true); 
  private urlsegment : string = 'Home';

  constructor(private router : Router, private renderer : Renderer2){
    
    // this.router.events.subscribe((event: Event) => {
    //   if (event instanceof NavigationStart ) {
    //     if(event.url.match(this.routePattern)){
    //       this.rotatelogo.update(rotate => true)
    //     }else{
    //       this.rotatelogo.update(rotate => false)
    //     }
    //   }
    // })

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        if(event.url.match(this.switchHome)){
          this.urlsegment = 'Inicio';
        }else{
          this.urlsegment = 'Home';
        }
      }
    })

    let _userdata = this.signalStoreSvc.RetrieveUserData();
    this.isLogged = computed(()=>  _userdata() !== null)

  }

  goInit(){
    this.router.navigateByUrl('/Linx/Inicio');    
  }

  goHome(){
    this.router.navigateByUrl(`/Linx/${this.urlsegment}`);
  }

  goToSignup(){
    this.router.navigateByUrl('/Linx/Registro');
  }

  goToSignin(){
    this.router.navigateByUrl('/Linx/Login');
  }

}
