import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';
import { IChat } from '../../models/chat/IChat';
import { IMessage } from '../../models/chat/IMessage';
import { IAccount } from '../../models/useraccount/IAccount';
import { SignalStorageService } from '../../services/signal-storage.service';
import { IUser } from '../../models/userprofile/IUser';
import { RestnodeService } from '../../services/restnode.service';
import { Subject, takeUntil } from 'rxjs';
import { initDropdowns} from 'flowbite';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ChatComponent implements OnInit, OnDestroy , AfterContentInit{

  @Input() isOpen = signal(false);
  @Input() chatRef!: IChat;
  @ViewChild('messageContainer') messageContainer!: ElementRef;
  @ViewChild('messageTextarea') messageTextarea!: ElementRef;

  private signalStorageSvc = inject(SignalStorageService);
  private restSvc = inject(RestnodeService);
  private socketSvc = inject(WebsocketService);
  private utilsvc = inject(UtilsService);

  public chat: IChat = {conversationname:'', participants: { userid_a: '', userid_b: '' }, messages: [], roomkey: '' };
  public message: IMessage = { text: '', timestamp: '', sender: { userid: '', linxname: '' } };
  public user!: IUser;
  public receiverAccount!: IAccount;

  private destroy$ = new Subject<void>();
  public messages: IMessage[] = [];

  constructor(private ref: ChangeDetectorRef) {
    this.socketSvc.getMessages().pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => {
      console.log('constr chat getMessages : ', data)
      this.messages.push(data);
      this.ref.detectChanges();
      this.scrollToBottom();
    });
  }
  
  closeModal() {
    this.isOpen.set(false);
  }

  setMessage(event: any) {
    this.message.text = event.target.value;
    this.message.timestamp = new Date().toISOString();
  }

  formateDate (date : string) : string{
    return this.utilsvc.dateAndHoursISOStringToLegible(date)
  }

  async sendMessage() {
    if (this.message.text.trim() !== '') {
      this.socketSvc.sendMessage( this.message, this.chatRef.roomkey);
      console.log('SENDING MESSAGE ------> ', this.message)
      this.messageTextarea.nativeElement.value = '';
      await this.storeMessage(this.message);
    }
  }

  async storeMessage(message: IMessage) {
    try {
      console.log('STORING MESSAGE ----> ', { chat: { participants: { userid_a: this.user.userid, userid_b: this.receiverAccount.userid }, message: message }, roomkey: this.chatRef.roomkey })
      const res = await this.restSvc.storeMessage({ participants: { userid_a: this.user.userid, userid_b: this.receiverAccount.userid }, message: message }, this.chatRef.roomkey);
    } catch (error) {
      console.log(error)
    }

  }

  private scrollToBottom(): void {
    setTimeout(() => {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    }, 1500);
  }

  initializeChat() {
    this.user = this.signalStorageSvc.RetrieveUserData()()!;
    this.receiverAccount = this.signalStorageSvc.RetrieveLinxData()()!;
    this.message.sender = { userid: this.user.userid, linxname: this.user.account.linxname }
    if (this.chatRef.messages !== null ) {
      this.messages = this.chatRef.messages;
      this.scrollToBottom();
    }
  }

  ngAfterContentInit(): void {
    this.scrollToBottom();
  }
  ngOnInit(): void {
    initDropdowns();
    this.initializeChat()
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
