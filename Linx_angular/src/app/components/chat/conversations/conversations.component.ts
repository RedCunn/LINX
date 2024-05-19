import { Component, Input, OnInit, inject, signal} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import{ChatComponent} from '../chat.component'
import { RestnodeService } from '../../../services/restnode.service';
import { SignalStorageService } from '../../../services/signal-storage.service';

@Component({
  selector: 'app-conversations',
  standalone: true,
  imports: [MatIcon, ChatComponent],
  templateUrl: './conversations.component.html',
  styleUrl: './conversations.component.css'
})
export class ConversationsComponent implements OnInit{
  
  @Input() isOpen = signal(false);
  private restSvc = inject(RestnodeService);
  private signalStorageSvc = inject(SignalStorageService);
  public isChatOpen = signal(false);

  openChat(){
    this.isChatOpen.update(v => !v);
  }
  
  closeModal(){
    this.isOpen.set(false);
  }
  
  loadChat(){
    console.log('hola 👹')
  }

  async ngOnInit(): Promise<void> {

   try {
    const usersignal = this.signalStorageSvc.RetrieveUserData();
    const user = usersignal();
    const jwtsignal = this.signalStorageSvc.RetrieveJWT();
    const jwt = jwtsignal();

    const res = await this.restSvc.getMyChats(user?.userid!, jwt!);
   } catch (error) {
    
   } 
  }
}
