import { Component, Renderer2, signal } from '@angular/core';
import { Event, NavigationStart, Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-mainheader',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './mainheader.component.html',
  styleUrl: './mainheader.component.css'
})
export class MainheaderComponent {

  public loggedUser = signal(false);

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

  }


  goHome(){
    this.router.navigateByUrl('/Linx/Inicio');
  }

  goToSignup(){
    this.router.navigateByUrl('/Linx/Registro');
  }

  goToSignin(){
    this.router.navigateByUrl('/Linx/Login');
  }

}
