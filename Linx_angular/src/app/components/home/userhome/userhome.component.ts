import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild, ViewContainerRef, inject, signal } from '@angular/core';
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
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'app-userhome',
  standalone: true,
  imports: [UserhomeasideComponent, MatIcon, FormsModule, RouterModule, ChatComponent, ArticlemodalformComponent, MyChainComponent],
  templateUrl: './userhome.component.html',
  styleUrl: './userhome.component.css'
})
export class UserhomeComponent implements OnInit, AfterViewInit , OnDestroy{

  private socketsvc : WebsocketService = inject(WebsocketService);
  private signalStoreSvc: SignalStorageService = inject(SignalStorageService);
  private restSvc: RestnodeService = inject(RestnodeService);
  private utilsvc : UtilsService = inject(UtilsService);
  
  @ViewChild('chatcompoContainer', {read : ViewContainerRef, static : true}) 
  public chatcompoContainer! : ViewContainerRef;

  public isChatOpen = signal(false);
  public isArtFormOpen = signal(false);
  public isExtChainOpen = signal(false);
  public isMyChainModal = signal(false);

  public isUser = signal(false);
  public isCandidate = signal(false);
  public isChained = signal(false);
  public isChainRequested = signal(false);
  public isChainBeingRequested = signal(false);

  public showBreakChainAlert = signal(false);
  public showJoinChainRequested = signal(false);
  public showChainBeingRequested = signal(false);

  public loadingArts = signal(false);

  public currentDate : Date = new Date();
  public userdata!: IUser | null;
  public linxdata!: IAccount | null;
  public candidateData! : IUser;
  public cadidateAttributes : Map<string,string>  = new Map<string,string>();
  public candidateResidency : string = '';
  public chat!: IChat;
  public articles : IArticle[] = [];
  public article: IArticle = {title: '', body: '', img: '', postedOn: '', useAsProfilePic: false }
  public extendedChain! : IAccount[];
  private roomkey! : string;

  public routePattern: RegExp = new RegExp("/Linx/Profile/[^/]+", "g");
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router, private ref: ChangeDetectorRef) {
    this.userdata  = this.signalStoreSvc.RetrieveUserData()();
    const routePatternMatch$ = new BehaviorSubject<string | null>(null);
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart || event instanceof NavigationEnd) {
        let signalcandidate = this.signalStoreSvc.RetrieveCandidateData()();
        if(signalcandidate !== null){
          console.log('LA CANDI : ', signalcandidate)
          this.candidateData = this.signalStoreSvc.RetrieveCandidateData()()!;
          this.isCandidate.set(true);
          this.articles = this.candidateData.account.articles!;
          this.cadidateAttributes = this.utilsvc.mapCandidateProfileDataToLegible(this.candidateData);
          this.getPlaceDetail()
        }else{
          this.isCandidate.set(false);
          this.linxdata = this.signalStoreSvc.RetrieveLinxData()();
          this.articles = this.linxdata?.articles!;
        }
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
        this.showAlert('all', false);
        this.isUser.set(false);
        this.isChained.set(this.isLinx());
        this.loadChatComponent();
        if(this.isLinx()){
          this.getExtendedChain(this.linxdata!);
          this.getExtendedChainRoomkeys()
        }
      } else {
        this.isUser.set(true);
      }
    });

  }
  //#region ----------------- SET UP ----------------------------------------

  async getPlaceDetail (){
    try {
      const res = await this.restSvc.getPlaceDetails(this.candidateData.geolocation.city_id);
      if(res.code === 0){
        const addrComponents = res.others.address_components;
        this.candidateResidency = addrComponents[1].long_name+' , ' + addrComponents[2].long_name;
      }else{
        console.log('RES DE GOOGLE : ', res.error)
      }
    } catch (error) {
      console.log('RES DE GOOGLE : ', error)
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
    
    this.chat = {conversationname:this.linxdata?.linxname!, participants : {userid_a : this.userdata?.userid! , userid_b : this.linxdata?.userid!}, roomkey : this.roomkey, messages : []}
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

  // isCandidate() : boolean {
  //   let onMatch = this.signalStoreSvc.RetrieveMatches()()!;
  //   let index = onMatch.findIndex(match => match.userid_a === this.linxdata?.userid || match.userid_b === this.linxdata?.userid)

  //   if(index !== -1){
  //     return false;
  //   }else{
  //     return true;
  //   }
  // }

  async getExtendedChain(linxdata : IAccount) {
    try {
      const res = await this.restSvc.getMyChain(linxdata.userid);
      if (res.code === 0) {
        const extaccounts : IAccount[] = res.others as IAccount[];
        const extarticles : IArticle[] = res.userdata as IArticle[];

        const extAccountsButMe = extaccounts.filter(acc => acc.userid !== this.userdata?.userid)

        this.extendedChain = this.utilsvc.putArticleObjectsIntoAccounts(extAccountsButMe, extarticles);
        console.log('EXTENDED CHAIN --------------', this.extendedChain);
      } else {
        console.log('', res.message);
      }
    } catch (error) {
      console.log('', error);
    }
  }

  async getExtendedChainRoomkeys (){
    try {
      const res = await this.restSvc.getExtendedChain(this.userdata?.userid! , this.linxdata?.userid!);
      if(res.code === 0){
        let roomkeysSet = res.userdata;
        this.utilsvc.joinRooms(roomkeysSet);
        console.log('retrieved EXTENDED CHAIN roomkeys',res.userdata)
      }else{
        console.log('retrieving EXTENDED CHAIN',res.message)
      }
    } catch (error) {
      console.log('ERROR retrieving EXTENDED CHAIN',error)
    }
  }

  async getMyChain(userdata: IUser) {
    try {
      const res = await this.restSvc.getMyChain(userdata.userid);
      if (res.code === 0) {
        let accounts: IAccount[] = res.others as IAccount[];
        const articles: IArticle[] = res.userdata as IArticle[];
        const wholeAccounts = this.utilsvc.putArticleObjectsIntoAccounts(accounts, articles);
        this.signalStoreSvc.StoreMyChain(wholeAccounts);
      } else {
        console.log('mychain never found...')
      }
    } catch (error) {
      console.log('mychain never found...', error)
    }
  }

//#endregion -----------------------------------------------------------------
  
  toggleChatModal() {
    this.isChatOpen.update(v => !v);
  }

  toggleArtFormModal() {
    this.isArtFormOpen.update(v => !v);
  }

  toggleExtChainModal(){
    this.isExtChainOpen.update(v => !v);
  }

  showAlert(alert : string, isOpen : boolean) {
    switch (alert) {
      case "breakchain":
        this.showBreakChainAlert.set(isOpen);   
        break;
      case "requestchain":
        this.showJoinChainRequested.set(isOpen);
        break;
      case "requestedchain":
        this.showChainBeingRequested.set(isOpen);
        break;
      case "all":
        this.showChainBeingRequested.set(false);
        this.showJoinChainRequested.set(false);
        this.showBreakChainAlert.set(false);  
        this.isChainBeingRequested.set(false);
        this.isChainRequested.set(false); 
        break;
      default:
        break;
    }
  }
  
  async requestJoinChain() {
    try {
      const res = await this.restSvc.requestJoinChain(this.userdata!.userid!, this.linxdata!.userid!)
      if (res.code === 0) {
        if(res.message === 'REQUESTING'){
          this.showJoinChainRequested.set(false);
          this.isChainRequested.set(true);
          this.isChained.set(false);
        }else{
          this.showAlert('all', false);
          this.isChained.set(true);
          this.socketsvc.linxchain(this.linxdata?.userid!, this.userdata?.userid!, this.userdata?.account!, this.linxdata!)
          const res = await this.getMyChain(this.userdata!)
          
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

  onArticleChange(newArt : any){
    console.log('NEW ART ON HOME : ', newArt)
    this.loadingArts.set(true);
    this.userdata?.account.articles?.unshift(newArt)
    this.ref.detectChanges();
    this.signalStoreSvc.StoreLinxData(this.userdata?.account!)
  }


  async ngOnInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      initFlowbite();
    }
    this.articles = [];
    if(this.isUser()){
      this.userdata?.account.articles!.forEach(a => {
        this.articles.push(a);
      });
    }else{
      this.linxdata?.articles?.forEach(a => {
        this.articles.push(a);
      })
    }
    
    try {
      //aquí me interesan las accounts a las que yo se lo he pedido
      const res = await this.restSvc.getJoinChainRequests(this.userdata!.userid);
      if (res.code === 0) {
        const joinRequests : {requestingUserid : string , requestedUserid : string , requestedAt : Date}[]= res.userdata.reqs;
        const joinRequestings : {requestingUserid : string , requestedUserid : string , requestedAt : Date}[]= res.others.reqs;

        if(joinRequests.length > 0){
          let reqIndex = joinRequests.findIndex(req => req.requestedUserid === this.linxdata?.userid)
          if(reqIndex !== -1){
            this.isChainRequested.set(true)
          }else{
            this.isChainRequested.set(false)
          }

        }else{
          this.isChainRequested.set(false)
        }

        if(joinRequestings.length > 0){
          let reqIndex = joinRequestings.findIndex(req => req.requestedUserid === this.userdata?.userid)
          if(reqIndex !== -1){
            this.isChainBeingRequested.set(true)
          }else{
            this.isChainBeingRequested.set(false)
          }
        }else{
          this.isChainBeingRequested.set(false)
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

  ngOnDestroy(): void {
    this.signalStoreSvc.StoreCandidateData(null);
  }

  logout() {
    this.signalStoreSvc.StoreUserData(null);
    this.signalStoreSvc.StoreJWT(null);
    this.socketsvc.disconnect();
    this.router.navigateByUrl('/Linx/Login');
  }
}
