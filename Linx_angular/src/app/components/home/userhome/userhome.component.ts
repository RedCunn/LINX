import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID, ViewChild, ViewContainerRef, inject, signal } from '@angular/core';
import { UserhomeasideComponent } from '../userhomeaside/userhomeaside.component';
import { MatIcon } from '@angular/material/icon';
import { SignalStorageService } from '../../../services/signal-storage.service';
import { IUser } from '../../../models/userprofile/IUser';
import { initFlowbite, initTooltips } from 'flowbite';
import { IArticle } from '../../../models/useraccount/IArticle';
import { isPlatformBrowser } from '@angular/common';
import { NgForm, FormsModule } from '@angular/forms';
import { RestnodeService } from '../../../services/restnode.service';
import { Event, NavigationEnd, NavigationStart, Router, RouterModule } from '@angular/router';
import { IAccount } from '../../../models/useraccount/IAccount';
import { ChatComponent } from '../../chat/chat.component';
import { IChat } from '../../../models/chat/IChat';
import { ArticlemodalformComponent } from './artmodal/articlemodalform.component';
import { IMessage } from '../../../models/chat/IMessage';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';
import { WebsocketService } from '../../../services/websocket.service';
import { MyChainComponent } from '../../mychain/mychain.component';

@Component({
  selector: 'app-userhome',
  standalone: true,
  imports: [UserhomeasideComponent, MatIcon, FormsModule, RouterModule, ChatComponent, ArticlemodalformComponent, MyChainComponent],
  templateUrl: './userhome.component.html',
  styleUrl: './userhome.component.css'
})
export class UserhomeComponent implements OnInit, AfterViewInit {

  private socketsvc : WebsocketService = inject(WebsocketService);
  private signalStoreSvc: SignalStorageService = inject(SignalStorageService);
  private restSvc: RestnodeService = inject(RestnodeService);
  
  @ViewChild('chatcompoContainer', {read : ViewContainerRef, static : true}) 
  public chatcompoContainer! : ViewContainerRef;

  public isChatOpen = signal(false);
  public isArtFormOpen = signal(false);
  public isExtChainOpen = signal(false);
  public isUser = signal(false);
  public isChained = signal(false);
  public isChainRequested = signal(false);
  public isChainBeingRequested = signal(false);
  public isMyChainModal = signal(false);
  public showBreakChainAlert = signal(false);
  public showJoinChainRequested = signal(false);

  public currentDate : Date = new Date();
  public userdata!: IUser | null;
  public linxdata!: IAccount | null;
  public chat!: IChat;
  public articles : IArticle[] = [];
  public article: IArticle = {title: '', bodycontent: '', img: '', postedOn: '', useAsUserPic: false }
  public extendedChain! : IAccount[];
  private roomkey! : string;

  public routePattern: RegExp = new RegExp("/Linx/Profile/[^/]+", "g");
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) {
    this.userdata  = this.signalStoreSvc.RetrieveUserData()();
    const routePatternMatch$ = new BehaviorSubject<string | null>(null);
    this.router.events.subscribe((event: Event) => {
    
      if (event instanceof NavigationStart || event instanceof NavigationEnd) {
        this.linxdata = this.signalStoreSvc.RetrieveLinxData()();
        if (event.url.match(this.routePattern)) {
          routePatternMatch$.next(event.url);
        } else {
          routePatternMatch$.next(null);
        }
      }
    })

    routePatternMatch$
    .pipe(distinctUntilChanged())
    .subscribe((url) => {
      if (url) {
        this.isUser.set(false);
        this.articles = this.linxdata?.articles !== undefined ? this.linxdata?.articles : [];
        this.isChained.set(this.isLinx());
        this.loadChatComponent();
        this.getExtendedChain();
      } else {
        this.isUser.set(true);
        this.articles = this.userdata?.account.articles !== undefined ? this.userdata?.account.articles : [];
      }
    });

  }

  async getExtendedChain(){
    try {
      const res = await this.restSvc.getExtendedChain(this.userdata?.userid! , this.linxdata?.userid!);
      if(res.code === 0){
        console.log('retrieved EXTENDED CHAIN',res.others)
        this.extendedChain = res.others;
      }else{
        console.log('retrieving EXTENDED CHAIN',res.message)
      }
    } catch (error) {
      console.log('ERROR retrieving EXTENDED CHAIN',error)
    }
  }

  async loadChatComponent () {
    const viewContainerRef = this.chatcompoContainer;
    viewContainerRef.clear();
    await this.setChat();
    const comporef = viewContainerRef.createComponent<ChatComponent>(ChatComponent);
    comporef.setInput('isOpen', this.isChatOpen);
    comporef.setInput('chatRef', this.chat);
  }

  async setChat(){
    this.roomkey = this.setRoomKey();
    
    this.chat = {participants : {userid_a : this.userdata?.userid! , userid_b : this.linxdata?.userid!}, roomkey : this.roomkey, messages : []}
    try {
      const res = await this.restSvc.getMyChats(this.roomkey, this.userdata?.userid!);
      if(res.code === 0){
        console.log('chat messages : ', res.others)
        const _resMess : IMessage[] = res.others !== null ? res.others.messages : [];
        this.chat.messages = [];
        if(_resMess.length > 0){
          _resMess.forEach( m => {this.chat.messages.push(m)});
        }
      }else{
        console.log('error recuperando chat...', res.message)
      }
    } catch (error) {
      console.log('error recuperando chat...', error)
    }
  }

  setRoomKey() : string {
    let _roomkey = '';

    if(this.isChained()){
      _roomkey = this.userdata?.account.myChain?.find(l => l.userid === this.linxdata?.userid)?.roomkey!
    }else{
      let _matches = this.signalStoreSvc.RetrieveMatches();
      _roomkey = _matches().find(m => (m.userid_a === this.userdata?.userid && m.userid_b === this.linxdata?.userid) || (m.userid_a === this.linxdata?.userid && m.userid_b === this.userdata?.userid))?.roomkey!;
    }
    return _roomkey; 
  }


  isLinx(): boolean {
    let onChain = this.userdata?.account.myChain?.find(l => l.userid === this.linxdata?.userid)
    return onChain !== undefined;
  }

  toggleChatModal() {
    this.isChatOpen.update(v => !v);
  }

  toggleArtFormModal() {
    this.isArtFormOpen.update(v => !v);
  }

  toggleExtChainModal(){
    this.isExtChainOpen.update(v => !v);
  }

  showAlert(alert : string) {
    switch (alert) {
      case "breakchain":
        this.showBreakChainAlert.set(true);   
        break;
      case "requestchain":
        this.showJoinChainRequested.set(true);
        break;
      default:
        break;
    }
  }
  closeAlert(alert : string){
    switch (alert) {
      case "breakchain":
        this.showBreakChainAlert.set(false);
        break;
      case "requestchain":
        this.showJoinChainRequested.set(false);
        break;
      default:
        break;
    }
  }

  async getMyChain(userdata: IUser) {
    try {
      const res = await this.restSvc.getMyChain(userdata.userid);
      if (res.code === 0) {
        this.signalStoreSvc.StoreMyChain(res.others);
      } else {
        console.log('mychain never found...')
      }
    } catch (error) {
      console.log('mychain never found...', error)
    }
  }

  async requestJoinChain() {
    try {
      const res = await this.restSvc.requestJoinChain(this.userdata!.userid!, this.linxdata!.userid!)
      if (res.code === 0) {
        if(res.message === 'REQUESTING'){
          this.showJoinChainRequested.set(false);
          this.isChainRequested.set(true);
        }else{
          this.isChainRequested.set(false);
          this.isChainBeingRequested.set(false);
          this.isChained.set(true);
          this.socketsvc.linxchain(this.linxdata?.userid!, this.userdata?.userid!, this.userdata?.account!, this.linxdata!)
          await this.getMyChain(this.userdata!)
        }
      } else {
        console.log(`${this.userdata?.account.linxname} and ${this.linxdata?.linxname} couldnt chain...`)
      }
    } catch (error) {
      console.log('error in requesting join chain...', error)
    }
  }

  async rejectJoinReq(){
    try {
      const res = await this.restSvc.rejectJoinChainRequest(this.userdata?.userid!, this.linxdata?.userid!)
      if(res.code === 0){
        this.isChainBeingRequested.set(false);
      }else{
        console.log('Error rejecting join request....', res.message)
      }
    } catch (error) {
      console.log('Error rejecting join request....',error)    
    }
  }

  async breakChain() {
    try {
      const res = await this.restSvc.breakChain(this.userdata?.userid!, this.linxdata?.userid!);
      if (res.code === 0) {
        this.router.navigateByUrl('/Linx/Inicio');
      } else {
        console.log('Error breaking chain.....', res.message);
      }
    } catch (error) {
      console.log('Error breaking chain.....', error);
    }
  }

  logout() {
    this.signalStoreSvc.StoreUserData(null);
    this.signalStoreSvc.StoreJWT(null);
    this.router.navigateByUrl('/Linx/Login');
  }

  async ngOnInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      initFlowbite();
    }
    try {
      const res = await this.restSvc.getJoinChainRequests(this.userdata!.userid);
      if (res.code === 0) {
        const joinRequests : {requestingUserid : string , requestedUserid : string , requestedAt : Date}[]= res.userdata;

        let isRequested = joinRequests.find(req => req.requestingUserid === this.linxdata?._id)

        if (isRequested) {
          this.isChainRequested.set(true);
          this.isChainBeingRequested.set(false);
        } else {
          this.isChainRequested.set(false);
          this.isChainBeingRequested.set(true);
        }

      } else {
        console.log('error getting join chain reqs ...', res.error)
      }
    } catch (error) {
      console.log('error getting join chain reqs ...', error)
    }
  }

  ngAfterViewInit(): void {
    initTooltips();
  }

}
