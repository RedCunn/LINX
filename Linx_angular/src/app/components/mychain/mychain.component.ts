import { Component, Input, OnInit, Signal, inject, signal } from '@angular/core';
import { IAccount } from '../../models/useraccount/IAccount';
import { LinxsonchainComponent } from './linxsonchain/linxsonchain.component';
import { IChainGroup } from '../../models/userprofile/IChainGroup';
import { IAdminGroups } from '../../models/userprofile/IAdminGroups';
import { SignalStorageService } from '../../services/signal-storage.service';
import { IUser } from '../../models/userprofile/IUser';

@Component({
  selector: 'app-mychain',
  standalone: true,
  imports: [LinxsonchainComponent],
  templateUrl: './mychain.component.html',
  styleUrl: './mychain.component.css'
})
export class MyChainComponent implements OnInit{

  @Input() isOpen = signal(false);
  @Input() isMyChain = signal(false);
  @Input() isAdminGroups = signal(false);
  @Input() isSharedChain = signal(false);
  @Input() myChains? : Array<IChainGroup>;
  @Input() sharedChains ? : Array<IChainGroup>;
  @Input() adminGroups ? : Array<IAdminGroups>;


  private signalsvc = inject(SignalStorageService)

  public user! : IUser ; 
  public isLinxsOnChainOpen = signal(false);
  public chain : IChainGroup = {chainid : '' , chainname : '' ,createdAt : '', linxsOnChain : [], linxExtents : []}
  public group : IAccount[] = [];
  public myLinxs : IAccount[] = [];
  public chainName : string = '';

  closeModal() {
    this.isOpen.set(false);
  }

  showLinsOnGroup (adgroup : IAdminGroups){
    this.chainName = adgroup.chainName;
    this.isAdminGroups.set(true);
    this.group = adgroup.accounts;
    this.isLinxsOnChainOpen.set(true);
  }
  showLinxsOnChain(chain : IChainGroup){
    this.chainName = chain.chainname;
    this.isAdminGroups.set(false);
    this.chain = chain;
    this.isLinxsOnChainOpen.set(true);
  }

  searchAdminNameOnMyLinxs (userid : string) : string{
    let adminname = "";

    if(userid === this.user.userid){
      return "Mis cadenas";
    }

    const linx = this.myLinxs.find(li => li.userid === userid)

    if(linx){
      adminname = linx?.linxname;
    }

    return adminname;
  }

  ngOnInit(): void {
    
    if(this.signalsvc.RetrieveMyLinxs()() !== null){
      this.myLinxs = this.signalsvc.RetrieveMyLinxs()()!;
    }else{
      this.myLinxs = []
    }
    this.user = this.signalsvc.RetrieveUserData()()!;
    console.log('SHARED CHAINS ON MY CHAIN COMPO : ', this.sharedChains)
    console.log('MY CHAINS ON CHAIN COMPO : ', this.myChains)
  }

}
