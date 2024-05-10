import { Component, ElementRef, Input, OnInit, ViewChild, inject, signal } from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';
import { IChat } from '../../models/chat/IChat';
import { IMessage } from '../../models/chat/IMessage';
import { IAccount } from '../../models/useraccount/IAccount';
import { SignalStorageService } from '../../services/signal-storage.service';
import { IUser } from '../../models/userprofile/IUser';
import { RestnodeService } from '../../services/restnode.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})

export class ChatComponent implements OnInit{
  
  @Input() isOpen = signal(false);
  @Input() linxChat! : IChat;
  @Input() linx! : IAccount;
  @ViewChild('messageContainer') messageContainer!: ElementRef;

  private signalStorageSvc = inject(SignalStorageService);
  private restSvc = inject(RestnodeService);
  private socketSvc = inject(WebsocketService);
  public chat : IChat = {chatid : '', participants : {userid : '', linxaccountid : ''}, messages : []};
  public message : IMessage = {text : '', timestamp : '', sender : {accountid : '', linxname : ''}};
  public user! : IUser;
  private jwt! : string;
  public messages : IMessage[] = [];

  closeModal(){
    this.isOpen.set(false);
  }

  setMessage(event : any){
    this.message.text = event.target.value;
    this.message.timestamp = new Date().toISOString();
  }

  async sendMessage(){
    if(this.message.text.trim() !== ''){
      this.socketSvc.sendMessage(this.message);
      //this.restSvc.senMessage(this.jwt,this.user.userid,this.linxChat.chatid,this.message);
      try {
        const newMessage = await this.socketSvc.receiveMessage();
        console.log('Mensaje recibido:', newMessage);
        this.messages.push(newMessage);
        setTimeout(() => {
          this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
        });
      } catch (error) {
        console.log(error)
      }
    }
  }  

 ngOnInit(): void{
    const _usersignal =  this.signalStorageSvc.RetrieveUserData();
    const _user = _usersignal();
    this.user = _user!;
    this.message.sender = {accountid  : this.user.accountid, linxname : this.user.account.linxname}

    const _jwtsignal = this.signalStorageSvc.RetrieveJWT();
    const _jwt = _jwtsignal();
    this.jwt = _jwt!;
  }

}
