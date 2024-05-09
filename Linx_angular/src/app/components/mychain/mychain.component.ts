import { Component, OnInit, inject } from '@angular/core';
import { RestnodeService } from '../../services/restnode.service';
import { SignalStorageService } from '../../services/signal-storage.service';
import { IUser } from '../../models/userprofile/IUser';
import { IAccount } from '../../models/useraccount/IAccount';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mychain',
  standalone: true,
  imports: [],
  templateUrl: './mychain.component.html',
  styleUrl: './mychain.component.css'
})
export class MyChainComponent implements OnInit{

  private restSvc = inject(RestnodeService);
  private signalStorageSvc = inject(SignalStorageService);
  private router = inject(Router);
  private _user! : IUser | null; 
  private _jwt! : string | null;
  public myChain! : IAccount[];

  goToLinxProfile(linx : IAccount){
    this.signalStorageSvc.StoreLinxData(linx);
    this.router.navigateByUrl(`/Linx/Profile/${linx.accountid}`);
  }
  
  async getMyChain(){
    try {
      const res = await this.restSvc.getMyChain(this._user?.userid!, this._jwt!);

      if(res.code === 0){
        console.log('ACCOUNTS on chain : ', res.others)
        this.myChain = res.others;
      }else{
        console.log('mychain never found...')
      }

    } catch (error) {
      console.log('mychain never found...', error)
    }
  }

  async ngOnInit(): Promise<void> {
    const signaluser= this.signalStorageSvc.RetrieveUserData() ;
    this._user = signaluser();
    const signaljwt = this.signalStorageSvc.RetrieveJWT();
    this._jwt = signaljwt();

    await this.getMyChain();
  }

}
