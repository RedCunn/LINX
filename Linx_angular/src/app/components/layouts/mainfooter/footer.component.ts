import { Component, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ConversationsComponent } from '../../chat/conversations/conversations.component';
import { InteractionsComponent } from '../../interactions/interactions.component';
import { MyChainComponent } from '../../mychain/mychain.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatIcon, ConversationsComponent, InteractionsComponent, MyChainComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

  
  toggleChatsModal() {
    
  }
  openInteractions() {

  }
  openCircle() {

  }
}
