import { Component, Input, OnInit, ViewChild, ViewContainerRef, inject, signal} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import{ChatComponent} from '../chat.component'
import { RestnodeService } from '../../../services/restnode.service';
import { SignalStorageService } from '../../../services/signal-storage.service';
import { IUser } from '../../../models/userprofile/IUser';
import { IChat } from '../../../models/chat/IChat';

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
  private _user! : IUser;
  public chats : IChat[] = [];
  public chatToOpen! : IChat; 

  openChat(chat : IChat){
    this.chatToOpen = chat;
    this.isChatOpen.update(v => !v);
  }
  
  closeModal(){
    this.isOpen.set(false);
  }
  
  loadChat(){
    console.log('hola 👹')
  }
  ngOnInit(){
    
  }
  // async ngOnInit(): Promise<void> {

  //  try {
  //   this._user = this.signalStorageSvc.RetrieveUserData()()!;
  //   const res = await this.restSvc.getMyChats( this._user?.userid!, null);
  //   if(res.code === 0){
  //     this.chats = res.others as IChat[]; 
  //     console.log('CHATS RECUPERADOS EN CONVERSACIONES ....', this.chats)
  //   }else{
  //     console.log('ERROR ON RETRIEVING CHATS ON CONVERCOMPO ; ', res.error)
  //   }
  //  } catch (error) {
  //   console.log('ERROR ON RETRIEVING CHATS ON CONVERCOMPO ; ', error)
  //  } 
  // }
}
