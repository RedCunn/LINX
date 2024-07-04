import { Component, Input, inject, signal } from '@angular/core';
import { RestnodeService } from '../../../../services/restnode.service';
import { SignalStorageService } from '../../../../services/signal-storage.service';
import { IUser } from '../../../../models/userprofile/IUser';

@Component({
  selector: 'app-editaccount',
  standalone: true,
  imports: [],
  templateUrl: './editaccount.component.html',
  styleUrl: './editaccount.component.scss'
})
export class EditaccountComponent {

  @Input() accountdata! : Object;

  private restsvc : RestnodeService = inject(RestnodeService);
  private signalsvc : SignalStorageService = inject(SignalStorageService);

  public user! : IUser;
  private _jwt! : string;
  public oldpassword : string = '';
  public newpassword : string = ''; 
  public isChangePwd = signal(false);
  public isAuthenticated = signal(false);
  public successPwdChanged = signal(false);

  public newpwd : Object = {newpwd : '', repnewpwd : ''};

  constructor(){
    this.user = this.signalsvc.RetrieveUserData()()!;
    this._jwt = this.signalsvc.RetrieveJWT()()!;
  }

  toggleChangePwd() {
    this.isChangePwd.set(true);
  }

  handleOldPwd(event : any){
    this.oldpassword = event.target.value;
    console.log('OLD : ',this.oldpassword)
  }

  async authenticate(){
    try {
      console.log('IS AUTH !!! 🎈')
      // const res = await this.restsvc.authenticate(this.user.userid, this._jwt, this.oldpassword)
      // if(res.code === 0){

      // }else{

      // }
    } catch (error) {
      
    }
  }

  async editAccountData(){
    try {
      const res = await this.restsvc.editAccount(this.user.userid, this._jwt, {linxname : this.user.account.linxname , email : this.user.account.email})
      if(res.code === 0){

      }else{

      }
    } catch (error) {
      
    }
  }

}
