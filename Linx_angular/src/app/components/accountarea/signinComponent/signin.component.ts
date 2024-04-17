import { Component, ElementRef, Renderer2, ViewChild, inject, signal } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IRestMessage } from '../../../models/IRestMessage';
import { RestnodeService } from '../../../services/restnode.service';
import { SignalStorageService } from '../../../services/signal-storage.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {

  private signalstoresvc : SignalStorageService = inject(SignalStorageService);
  @ViewChild('emailorlinxname') emailorlinxname!: ElementRef;
  @ViewChild('password') password!: ElementRef;
  public credentials : {emailorlinxname : String, password : String } = {emailorlinxname : '', password : '' } ;
  public loginerrors = signal(false);
  

  constructor(private router : Router, private restSvc : RestnodeService, private renderer : Renderer2){}
  
  goToSignup(){
    this.router.navigateByUrl('/Linx/Registro');
  }

  async Signin( loginForm : NgForm){
    
    // if (loginForm.control.get('emailorlinxname')?.status !== 'VALID') {
    //   this.renderer.setAttribute(this.emailorlinxname.nativeElement, 'style', 'background-color: pink');
    //   return;
    // } else {
    //   this.renderer.setAttribute(this.emailorlinxname.nativeElement, 'style', 'background-color : lightblue');
    // }

    // if (loginForm.control.get('password')?.status !== 'VALID') {
    //   this.renderer.setAttribute(this.password.nativeElement, 'style', 'background-color: pink');
    //   return;
    // } else {
    //   this.renderer.setAttribute(this.password.nativeElement, 'style', 'background-color: lightblue');
    // }
    
    const _response:IRestMessage = await this.restSvc.signin({emailorlinxname : loginForm.control.get('emailorlinxname')?.value, password :loginForm.control.get('password')?.value});
    
    if(_response.code === 0){
      this.signalstoresvc.StoreUserData(_response.userdata);
      console.log('RETRIEVED USERDATA : ', _response.userdata)
      this.signalstoresvc.StoreJWT(_response.token!);
      console.log('RETRIEVED JWT : ',_response.token!)
      this.router.navigateByUrl('/Linx/Inicio');
    }else{
      this.loginerrors.update(v=> true);
    }
    
  }  

}
