import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, inject, signal } from '@angular/core';
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
  styleUrl: './chat.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ChatComponent implements OnInit, OnDestroy {

  @Input() isOpen = signal(false);
  @Input() chatRef!: IChat;
  @ViewChild('messageContainer') messageContainer!: ElementRef;
  @ViewChild('messageTextarea') messageTextarea!: ElementRef;

  private signalStorageSvc = inject(SignalStorageService);
  private restSvc = inject(RestnodeService);
  private socketSvc = inject(WebsocketService);

  public chat: IChat = { participants: { userid_a: '', userid_b: '' }, messages: [], roomkey: '' };
  public message: IMessage = { text: '', timestamp: '', sender: { accountid: '', linxname: '' } };
  public user!: IUser;
  public receiverAccount!: IAccount;
  public messages = signal<IMessage[]>([]);
  private roomkey!: string;

  constructor(private ref: ChangeDetectorRef) {
    this.socketSvc.getMessages().subscribe((message: IMessage) => {
      this.messages.update((mss) => [...mss, message]);
      this.ref.detectChanges();
      this.scrollToBottom();
    })
  }

  closeModal() {
    this.isOpen.set(false);
  }

  setMessage(event: any) {
    this.message.text = event.target.value;
    this.message.timestamp = new Date().toISOString();
  }

  async sendMessage() {
    if (this.message.text.trim() !== '') {
      this.socketSvc.sendMessage(this.chatRef.participants.userid_a, this.chatRef.participants.userid_b, this.message, this.chatRef.roomkey);
      this.messageTextarea.nativeElement.value = '';
      await this.storeMessage(this.message);
    }
  }

  async storeMessage(message: IMessage) {
    try {
      const res = await this.restSvc.storeMessage({ participants: { userid_a: this.user.userid, userid_b: this.receiverAccount.userid }, message: message }, this.chatRef.roomkey);
    } catch (error) {
      console.log(error)
    }

  }

  private scrollToBottom(): void {
    setTimeout(() => {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    }, 100);
  }

  private joinRoom(): void {
    this.socketSvc.initChat(this.chatRef.roomkey);
  }
  ngOnInit(): void {
    
    this.user = this.signalStorageSvc.RetrieveUserData()()!;
    this.receiverAccount = this.signalStorageSvc.RetrieveLinxData()()!;
    this.message.sender = { accountid: this.user.accountid, linxname: this.user.account.linxname }
    
    if (this.chatRef.messages !== undefined) {
      this.messages.update((current) => [...this.chatRef.messages])
    }
    this.joinRoom();
  }

  ngOnDestroy(): void {

  }

}
