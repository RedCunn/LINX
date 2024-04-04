import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IRestMessage } from '../../../models/restmessage';
import { RestnodeService } from '../../../services/restnode.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {

  @ViewChild('emailorlinxname') emailorlinxname!: ElementRef;
  @ViewChild('password') password!: ElementRef;
  public credentials : {emailorlinxname : String, password : String } = {emailorlinxname : '', password : '' } ;
  public loginerrors : String = '';
  

  constructor(private router : Router, private restSvc : RestnodeService, private renderer : Renderer2){}
  
  goToSignup(){
    this.router.navigateByUrl('/Linx/Registro');
  }

  async Signin( loginForm : NgForm){

    const _response:IRestMessage = await this.restSvc.signin({emailorlinxname : loginForm.control.get('emailorlinxname')?.value, password :loginForm.control.get('password')?.value});
    
    if (loginForm.control.get('emailorlinxname')?.status !== 'VALID') {
      this.renderer.setAttribute(this.emailorlinxname.nativeElement, 'style', 'background-color: pink');
      return;
    } else {
      this.renderer.setAttribute(this.emailorlinxname.nativeElement, 'style', 'background-color : lightblue');
    }

    if (loginForm.control.get('password')?.status !== 'VALID') {
      this.renderer.setAttribute(this.password.nativeElement, 'style', 'background-color: pink');
      return;
    } else {
      this.renderer.setAttribute(this.password.nativeElement, 'style', 'background-color: lightblue');
    }

    
    
    
    if(_response.code === 0){
      
      this.router.navigateByUrl('/Inicio');
    }else{
      this.loginerrors = _response.error!;
    }
    
  }  

}
