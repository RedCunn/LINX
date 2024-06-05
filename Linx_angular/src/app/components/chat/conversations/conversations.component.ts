import { Component, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef, inject, signal} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import{ChatComponent} from '../chat.component'
import { SignalStorageService } from '../../../services/signal-storage.service';
import { IUser } from '../../../models/userprofile/IUser';
import { IChat } from '../../../models/chat/IChat';
import { UtilsService } from '../../../services/utils.service';
import { IMessage } from '../../../models/chat/IMessage';
import { WebsocketService } from '../../../services/websocket.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-conversations',
  standalone: true,
  imports: [MatIcon, ChatComponent],
  templateUrl: './conversations.component.html',
  styleUrl: './conversations.component.css'
})
export class ConversationsComponent implements OnDestroy{
  
  @Input() isOpen = signal(false);
  @Input() chats! : IChat[];
  private signalStorageSvc = inject(SignalStorageService);
  private utilsvc = inject(UtilsService);
  private socketsvc = inject(WebsocketService);

  public isChatOpen = signal(false);
  private _user! : IUser;
  public chatToOpen : IChat = {conversationname : '',participants : {userid_a : '', userid_b : ''},roomkey : '',messages : []}; 
  public messageCountMap : Map<string , number> = new Map<string,number>();
  
  @ViewChild('chatcompoContainer', { read: ViewContainerRef, static: true })
  public chatcompoContainer!: ViewContainerRef;

  private destroy$ = new Subject<void>();

  constructor(){
    this._user = this.signalStorageSvc.RetrieveUserData()()!;

    this.socketsvc.getReadMessages().pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => {
      console.log('read message on conversations : ', data)
    });

  }

  loadChatComponent() {
    const viewContainerRef = this.chatcompoContainer;
    viewContainerRef.clear();
    const comporef = viewContainerRef.createComponent<ChatComponent>(ChatComponent);
    comporef.setInput('isOpen', this.isChatOpen);
    comporef.setInput('chatRef', this.chatToOpen);
  }

  async setChat(chat : IChat) {
      this.chatToOpen = chat;
      let chatuserid = chat.participants.userid_a === this._user.userid ? chat.participants.userid_b : chat.participants.userid_a;
      let roomkey = this.utilsvc.setRoomKey(this._user.userid , chatuserid);
      this.chatToOpen.roomkey = roomkey;
      this.chatToOpen.messages.forEach(mess => {
        
      })
  }

  countMessagesUnread(messages : IMessage []) : number{
    let count = 0;
    
    messages.forEach(m => {
      if(!m.isRead && m.sender.userid !== this._user.userid){
        count ++;
      }
    })

    return count;
  }

  openChat(chat : IChat){
    chat.messages.forEach(m =>  {
      m.isRead = true;
    })
    this.setChat(chat);
    this.loadChatComponent();
    this.isChatOpen.update(v => !v);
  }
  
  closeModal(){
    this.isOpen.set(false);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
