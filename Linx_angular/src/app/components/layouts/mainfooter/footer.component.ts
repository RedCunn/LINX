import { Component, OnDestroy, ViewChild, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ConversationsComponent } from '../../chat/conversations/conversations.component';
import { InteractionsComponent } from '../../interactions/interactions.component';
import { MyChainComponent } from '../../mychain/mychain.component';
import { ModaldraftComponent } from '../../pruebamodal/modaldraft.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatIcon, ConversationsComponent, InteractionsComponent, MyChainComponent, ModaldraftComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent{

  public isMyChainOpen = signal(false);
  public isMyChain = signal(true);
  public isChatsOpen = signal(false);
  public isInteractionsOpen = signal(false);

  toggleChatsModal() {
    this.isChatsOpen.update(v => !v)  
    this.isInteractionsOpen.set(false);
    this.isMyChainOpen.set(false);
  }
  toggleInteractionsModal() {
    this.isInteractionsOpen.update(v => !v)
    this.isChatsOpen.set(false);
    this.isMyChainOpen.set(false);
  }
  
  toggleMyChainModal() {
    this.isMyChainOpen.update(v => !v);
    this.isInteractionsOpen.set(false);
    this.isChatsOpen.set(false);
  }

}
