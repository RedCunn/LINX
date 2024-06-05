import { Component, Input, OnInit, Signal, inject, signal } from '@angular/core';
import { IAccount } from '../../models/useraccount/IAccount';
import { LinxsonchainComponent } from './linxsonchain/linxsonchain.component';

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
  @Input() myChains? : Array<{chainid : string , chainname : string , linxs : IAccount[]}>;
  @Input() sharedChains ? : Array<{chainid : string , chainname : string , linxs : IAccount[]}>;

  public isLinxsOnChainOpen = signal(false);
  public chain : {chainid : string , chainname : string , linxs : IAccount[]} = {chainid : '' , chainname : '' , linxs : []}

  closeModal() {
    this.isOpen.set(false);
  }

  showLinxsOnChain(chain : {chainid : string , chainname : string , linxs : IAccount[]}){
    this.chain = chain;
    this.isLinxsOnChainOpen.set(true);
  }

  ngOnInit(): void {
    console.log('SHARED CHAINS ON MY CHAIN COMPO : ', this.sharedChains)
    console.log('MY CHAINS ON CHAIN COMPO : ', this.myChains)
  }

}
