import { Component, Input, OnInit, Signal, inject, signal } from '@angular/core';
import { IAccount } from '../../models/useraccount/IAccount';
import { LinxsonchainComponent } from './linxsonchain/linxsonchain.component';
import { IChainGroup } from '../../models/userprofile/IChainGroup';
import { IAdminGroups } from '../../models/userprofile/IAdminGroups';

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

  public isLinxsOnChainOpen = signal(false);
  public chain : IChainGroup = {chainid : '' , chainname : '' ,createdAt : '', linxsOnChain : [], linxExtents : []}
  public group : IAccount[] = [];

  closeModal() {
    this.isOpen.set(false);
  }

  showLinsOnGroup (adgroup : IAdminGroups){
    this.isAdminGroups.set(true);
    this.group = adgroup.accounts;
    this.isLinxsOnChainOpen.set(true);
  }
  showLinxsOnChain(chain : IChainGroup){
    this.isAdminGroups.set(false);
    this.chain = chain;
    this.isLinxsOnChainOpen.set(true);
  }

  ngOnInit(): void {
    console.log('SHARED CHAINS ON MY CHAIN COMPO : ', this.sharedChains)
    console.log('MY CHAINS ON CHAIN COMPO : ', this.myChains)
  }

}
