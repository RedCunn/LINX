import { Component, Renderer2, signal } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private router : Router, private renderer : Renderer2){}


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
