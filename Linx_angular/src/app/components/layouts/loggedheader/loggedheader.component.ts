import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { SignalStorageService } from '../../../services/signal-storage.service';
import { IAccount } from '../../../models/useraccount/IAccount';
import { Router } from '@angular/router';
import {MyChainComponent} from '../../mychain/mychain.component'
import { IChainGroup } from '../../../models/userprofile/IChainGroup';
import { UtilsService } from '../../../services/utils.service';
import { IUser } from '../../../models/userprofile/IUser';

@Component({
  selector: 'app-loggedheader',
  standalone: true,
  imports: [MyChainComponent],
  templateUrl: './loggedheader.component.html',
  styleUrl: './loggedheader.component.css'
})
export class LoggedheaderComponent implements OnInit{
  
  private signalStoreSvc : SignalStorageService = inject(SignalStorageService);

  public isMyChainOpen = signal(false);
  public isMyChain = signal(true);
  private user! : IUser;
  public myChains! : IChainGroup[];

  constructor(private router : Router){
    this.user = this.signalStoreSvc.RetrieveUserData()()!;
  }

  ngOnInit(): void {
    if(this.signalStoreSvc.RetrieveGroupedLinxs()() !== null){
      this.myChains = this.signalStoreSvc.RetrieveGroupedLinxs()()!
    }else{
      this.myChains = []
    }
    this.isMyChain.set(true);
  }

  goInit(){
    this.router.navigateByUrl(`/Linx/Inicio`);
  }
  goHome(){
    this.router.navigateByUrl(`/Linx/Home`);
  }

  toggleMyChainModal() {
    this.isMyChainOpen.update(v => !v);
  }

}
