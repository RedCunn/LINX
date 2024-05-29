import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IRestMessage } from '../../../models/IRestMessage';
import { RestnodeService } from '../../../services/restnode.service';
import { SignalStorageService } from '../../../services/signal-storage.service';
import { WebsocketService } from '../../../services/websocket.service';
import { IUser } from '../../../models/userprofile/IUser';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent{

  private socketSvc : WebsocketService = inject(WebsocketService);
  private signalstoresvc : SignalStorageService = inject(SignalStorageService);

  @ViewChild('emailorlinxname') emailorlinxname!: ElementRef;
  @ViewChild('password') password!: ElementRef;

  public credentials : {emailorlinxname : String, password : String } = {emailorlinxname : '', password : '' } ;
  public loginerrors = signal(false);

  constructor(private router : Router, private restSvc : RestnodeService){}
  
  goToSignup(){
    this.router.navigateByUrl('/Linx/Registro');
  }

  async getMyChain(userdata : IUser){
    try {
      const res = await this.restSvc.getMyChain(userdata.userid);
      if(res.code === 0){
        this.signalstoresvc.StoreMyChain(res.others);
      }else{
        console.log('mychain never found...')  
      }
    } catch (error) {
      console.log('mychain never found...', error)
    }
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
      const user : IUser = _response.userdata;
      user.account.articles = _response.others;
      this.signalstoresvc.StoreUserData(user);
      this.signalstoresvc.StoreJWT(_response.token!);
      this.socketSvc.initUserRoom(user.userid);
      await this.getMyChain(user)
      this.socketSvc.userLogin(user.account._id!, user.account.linxname);
      this.router.navigateByUrl('/Linx/Inicio');
    }else{
      this.loginerrors.update(v=> true);
    }
    
  }  

}
