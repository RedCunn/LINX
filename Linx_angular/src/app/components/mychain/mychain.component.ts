import { Component, Input, OnInit, ViewChild, inject, signal } from '@angular/core';
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

  @Input() isOpen = signal(false);

  closeModal() {
    this.isOpen.set(false);
  }

  private restSvc = inject(RestnodeService);
  private signalStorageSvc = inject(SignalStorageService);
  private router = inject(Router);
  private _user! : IUser | null; 
  public myChain! : IAccount[];

  goToLinxProfile(linx : IAccount){
    this.isOpen.set(false);
    this.signalStorageSvc.StoreLinxData(linx);
    this.router.navigateByUrl(`/Linx/Profile/${linx.linxname}`);
  }
  
  async getMyChain(){
    try {
      const res = await this.restSvc.getMyChain(this._user?.userid!);

      if(res.code === 0){
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

    await this.getMyChain();
  }

}
