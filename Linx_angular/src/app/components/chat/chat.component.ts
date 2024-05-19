import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, inject, signal } from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';
import { IChat } from '../../models/chat/IChat';
import { IMessage } from '../../models/chat/IMessage';
import { IAccount } from '../../models/useraccount/IAccount';
import { SignalStorageService } from '../../services/signal-storage.service';
import { IUser } from '../../models/userprofile/IUser';
import { RestnodeService } from '../../services/restnode.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})

export class ChatComponent implements OnInit, OnDestroy {

  @Input() isOpen = signal(false);
  @Input() linxChat!: IChat;
  @ViewChild('messageContainer') messageContainer!: ElementRef;
  @ViewChild('messageTextarea') messageTextarea!: ElementRef;

  private signalStorageSvc = inject(SignalStorageService);
  private restSvc = inject(RestnodeService);
  private socketSvc = inject(WebsocketService);
  public chat: IChat = { chatid: '', participants: { userid_a: '', userid_b: '' }, messages: [], roomkey : '' };
  public message: IMessage = {messageid : '', text: '', timestamp: '', sender: { accountid: '', linxname: '' } };
  public user!: IUser;
  public receiverAccount! : IAccount;
  private jwt!: string;
  public messages = signal<IMessage[]>([]);
  private roomkey! : string ; 

  constructor(private ref : ChangeDetectorRef){
    const _usersignal = this.signalStorageSvc.RetrieveUserData();
    this.user = _usersignal()!;
    const _linxsignal = this.signalStorageSvc.RetrieveLinxData();
    this.receiverAccount = _linxsignal()!; 
    console.log('USER ON CHAT : ', this.user)
    console.log('LINX ON CHAT : ', this.receiverAccount)
    this.message.sender = { accountid: this.user.accountid, linxname: this.user.account.linxname }

    if(this.user.account.myChain!.length > 0){
      this.joinRoom(this.user.account.myChain!);
    }
    
    this.socketSvc.getMessages().subscribe((message: IMessage) => {
      this.messages.update((mss)=>[...mss, message]);
      this.ref.detectChanges();
      this.scrollToBottom();
    })
  }

  closeModal() {
    this.isOpen.set(false);
  }

  generateUniqueId() : string{
    // Usa la fecha actual en milisegundos y un valor aleatorio
    const currentDate = (new Date()).toISOString();
    const randomValue = Math.random().toString();

    // Concatena los valores y usa SHA-256 para generar un hash
    const rawId = currentDate + randomValue;
    const uniqueId = CryptoJS.SHA256(rawId).toString(CryptoJS.enc.Hex);

    return uniqueId;
}

  setMessage(event: any) {
    this.message.messageid = this.generateUniqueId();
    this.message.text = event.target.value;
    this.message.timestamp = new Date().toISOString();
  }

  sendMessage() {
    if (this.message.text.trim() !== '') {
      this.socketSvc.sendMessage(this.message, this.roomkey);
      this.messageTextarea.nativeElement.value = '';
      //await this.storeMessage(this.message);
    }
  }

  async storeMessage(message: IMessage) {
    try {
      this.restSvc.storeMessage(this.jwt, this.user.userid, this.linxChat.chatid, message);
    } catch (error) {
      console.log(error)
    }

  }

  private scrollToBottom(): void {
      setTimeout(() => {
        this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
      }, 100); 
  }

  private joinRoom(chain : {userid : string , roomkey : string}[]) : void {
    this.roomkey = chain.find((linx) => linx.userid === this.receiverAccount.userid)?.roomkey!;
    this.chat = {chatid:'',participants : {userid_a : this.user.userid, userid_b : this.receiverAccount.userid}, messages : [], roomkey : this.roomkey}
    console.log('joined room : ', this.roomkey) 
    this.socketSvc.initChat(this.roomkey);
  }

  ngOnInit(): void {
    const _jwtsignal = this.signalStorageSvc.RetrieveJWT();
    const _jwt = _jwtsignal();
    this.jwt = _jwt!;
  }

  ngOnDestroy(): void {
    
  }

}
