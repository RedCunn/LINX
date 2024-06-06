import { Component, Input, OnInit, Signal, inject, signal } from '@angular/core';
import { IAccount } from '../../models/useraccount/IAccount';
import { LinxsonchainComponent } from './linxsonchain/linxsonchain.component';
import { IChainGroup } from '../../models/userprofile/IChainGroup';

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
  @Input() myChains? : Array<IChainGroup>;
  @Input() sharedChains ? : Array<IChainGroup>;

  public isLinxsOnChainOpen = signal(false);
  public chain : IChainGroup = {chainid : '' , chainname : '' ,createdAt : '', linxsOnChain : [], linxExtents : []}

  closeModal() {
    this.isOpen.set(false);
  }

  showLinxsOnChain(chain : IChainGroup){
    this.chain = chain;
    this.isLinxsOnChainOpen.set(true);
  }

  ngOnInit(): void {
    console.log('SHARED CHAINS ON MY CHAIN COMPO : ', this.sharedChains)
    console.log('MY CHAINS ON CHAIN COMPO : ', this.myChains)
  }

}
