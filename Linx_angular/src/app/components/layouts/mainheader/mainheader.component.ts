import { Component, OnInit, Renderer2, Signal, computed, inject, signal } from '@angular/core';
import { Event, NavigationStart, Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { SignalStorageService } from '../../../services/signal-storage.service';
import { IUser } from '../../../models/userprofile/user';

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
  public rotatelogo = signal(true); 

  constructor(private router : Router, private renderer : Renderer2){
    
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart ) {
        if(event.url.match(this.routePattern)){
          this.rotatelogo.update(rotate => true)
        }else{
          this.rotatelogo.update(rotate => false)
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
    this.router.navigateByUrl('/Linx/Home');
  }

  goToSignup(){
    this.router.navigateByUrl('/Linx/Registro');
  }

  goToSignin(){
    this.router.navigateByUrl('/Linx/Login');
  }

}
