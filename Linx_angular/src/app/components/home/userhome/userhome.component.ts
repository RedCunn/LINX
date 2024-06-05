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
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';
import { WebsocketService } from '../../../services/websocket.service';
import { MyChainComponent } from '../../mychain/mychain.component';
import { UtilsService } from '../../../services/utils.service';
import { ChainsmodalComponent } from './chainsmodal/chainsmodal.component';


@Component({
  selector: 'app-userhome',
  standalone: true,
  imports: [UserhomeasideComponent, MatIcon, FormsModule, RouterModule, ChatComponent, ArticlemodalformComponent, MyChainComponent, ChainsmodalComponent],
  templateUrl: './userhome.component.html',
  styleUrl: './userhome.component.css'
})
export class UserhomeComponent implements OnInit, AfterViewInit, OnDestroy{

  private socketsvc: WebsocketService = inject(WebsocketService);
  private signalStoreSvc: SignalStorageService = inject(SignalStorageService);
  private restSvc: RestnodeService = inject(RestnodeService);
  private utilsvc: UtilsService = inject(UtilsService);

  @ViewChild('chatcompoContainer', { read: ViewContainerRef, static: true })
  public chatcompoContainer!: ViewContainerRef;

  public isChatOpen = signal(false);
  public isArtFormOpen = signal(false);
  public isChainOpen = signal(false);
  public isPickChainOpen = signal(false);

  public isUser = signal(false);
  public isCandidate = signal(false);
  public isChained = signal(false); 
  public isExtendedLinx = signal(false); 
  public isMatch = signal(false); 

  public loadingArts = signal(false);

  public currentDate: Date = new Date();
  public userdata!: IUser | null;
  public linxdata!: IAccount | null;
  public candidateData!: IUser;
  public cadidateAttributes: Map<string, string> = new Map<string, string>();
  public candidateResidency: string = '';
  public chat!: IChat;
  public articles: IArticle[] = [];
  public article: IArticle = { articleid: '', title: '', body: '', img: '', postedOn: '', useAsProfilePic: false }
  private roomkey!: string;

  //__ REBUILT _
  //OLD : 
  public isMyChain = signal(false);
  public extendedChain!: IAccount[];
  public extendedChainKeys: { mylinxuserid: string, userid: string, roomkey: string }[] = [];
  //OLD : va para interactions
  public isChainBeingRequested = signal(false);
  public showBreakChainAlert = signal(false);
  public showChainBeingRequested = signal(false);
  public isChainRequested = signal(false);
  //NEW : 
  public areMyChains = signal(false);
  public chainExtents : Array<{chainid : string , mylinxuserid : string, linxs : IAccount[]}> = [];
  public acceptedChainsReq : Array<{chainid : string, accepted : boolean} > = [];
  public sharedChains : Array<{chainid : string , chainname : string , linxs : IAccount[]}> = [];
  public myChains : Array<{chainid : string , chainname : string , createdAt : string, linxs : IAccount[]}> = [];
  //_---------------------------
  public routePattern: RegExp = new RegExp("/Linx/Profile/[^/]+", "g");

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router, private ref: ChangeDetectorRef) {
    this.userdata = this.signalStoreSvc.RetrieveUserData()();
    const routePatternMatch$ = new BehaviorSubject<string | null>(null);
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart || event instanceof NavigationEnd) {
        let signalcandidate = this.signalStoreSvc.RetrieveCandidateData()();
        if (signalcandidate !== null) {
          this.candidateData = this.signalStoreSvc.RetrieveCandidateData()()!;
          this.isCandidate.set(true);
          this.cadidateAttributes = this.utilsvc.mapCandidateProfileDataToLegible(this.candidateData);
          this.getPlaceDetail()
        } else {
          this.isCandidate.set(false);
          this.linxdata = this.signalStoreSvc.RetrieveLinxData()();
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
          this.isMatch.set(!this.isLinx());
          this.loadChatComponent();
          if (this.isLinx()) {
            this.getExtendedChain()
            this.isMyChain.set(false);
          } else {
            this.isMyChain.set(true);
          }
        } else {
          this.isUser.set(true);
        }
        this.articles = []
        this.loadProfileArticles()
      });
  }
  //#region ----------------- SET UP ----------------------------------------

  async getExtendedChain (){
    const res = await this.utilsvc.getExtendedChainFromLinx(this.linxdata!.userid , this.userdata?.userid!)
    this.extendedChain = res;
  }

  async getPlaceDetail() {
    try {
      const res = await this.restSvc.getPlaceDetails(this.candidateData.geolocation.city_id);
      if (res.code === 0) {
        const addrComponents = res.others.address_components;
        this.candidateResidency = addrComponents[1].long_name + ' , ' + addrComponents[2].long_name;
      } else {
        console.log('RES DE GOOGLE : ', res.error)
      }
    } catch (error) {
      console.log('RES DE GOOGLE : ', error)
    }
  }

  async loadChatComponent() {
    const viewContainerRef = this.chatcompoContainer;
    viewContainerRef.clear();
    await this.setChat();
    const comporef = viewContainerRef.createComponent<ChatComponent>(ChatComponent);
    comporef.setInput('isOpen', this.isChatOpen);
    comporef.setInput('chatRef', this.chat);
  }

  async setChat() {
    this.roomkey = this.utilsvc.setRoomKey(this.userdata?.userid! ,this.linxdata?.userid!);
    this.chat = { conversationname: this.linxdata?.linxname!, participants: { userid_a: this.userdata?.userid!, userid_b: this.linxdata?.userid! }, roomkey: this.roomkey, messages: [] }
    try {
      const res = await this.restSvc.getMyChats(this.userdata?.userid!, this.linxdata?.userid!);
      console.log('RESPONSE GETTING CHATS HOME : ', res)
      if (res.code === 0) {
        const _resMess: IChat[] = res.others;
        this.chat.messages = [];
        _resMess.forEach(chat => {
          chat.messages.forEach(mess => {
            this.chat.messages.push(mess)
          })
        })
        console.log('RES OTHERS ON SET CHAT GET MY CHATS home: ', res.others)
      } else {
        console.log('error recuperando chat...', res.message)
      }
    } catch (error) {
      console.log('error recuperando chat...', error)
    }
  }
  
  isLinx(): boolean {
    let onChain = this.userdata?.account.myLinxs?.find(l => l.userid === this.linxdata?.userid)
    return onChain !== undefined;
  }

  //#endregion -----------------------------------------------------------------

  toggleChatModal() {
    this.isChatOpen.update(v => !v);
  }

  toggleArtFormModal(article: IArticle | null) {
    if (article !== null) {
      this.article = article
    } else {
      this.article = { title: '', body: '', img: '', postedOn: '', useAsProfilePic: false }
    }
    this.isArtFormOpen.update(v => !v);
  }

  toggleChainModal() {
    this.isMyChain.set(false);
    this.isChainOpen.update(v => !v);
  }

  togglePickChainModal(){
    this.isPickChainOpen.update(v => !v);
  }

  showAlert(alert: string, isOpen: boolean) {
    switch (alert) {
      case "breakchain":
        this.showBreakChainAlert.set(isOpen);
        break;
      case "requestedchain":
        this.showChainBeingRequested.set(isOpen);
        break;
      case "all":
        this.showChainBeingRequested.set(false);
        this.showBreakChainAlert.set(false);
        this.isChainBeingRequested.set(false);
        this.isChainRequested.set(false);
        break;
      default:
        break;
    }
  }

  async answerJoinReq() {
    try {
      const res = await this.restSvc.answerToJoinChainRequest(this.userdata?.userid!, this.linxdata?.userid!, this.acceptedChainsReq)
      if (res.code === 0) {
        this.isChainBeingRequested.set(false);
      } else {
        console.log('Error rejecting join request....', res.message)
      }
    } catch (error) {
      console.log('Error rejecting join request....', error)
    }
  }

  async acceptJoinChainRequest(){
    try {
      //const res = await this.restSvc.requestJoinChain(this.userdata!.userid!, this.linxdata!.userid!, this.chainsToAdd)
    } catch (error) {
      
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

  onArticleChange(newArts: IArticle[]) {
    console.log('NEW ARTsss ON HOME : ', newArts)
    this.loadingArts.set(true);
    this.articles = newArts;
    this.ref.detectChanges();
    this.loadingArts.set(false);
  }

  onIsChainedChange (value : boolean){
    this.isChained.set(value);
  }

  onIsChainRequestedChange (value : boolean){
    this.isChainRequested.set(value)
  }

  onShowAlertsChange (value : {alert : string , isOpen : boolean}){
   this.showAlert(value.alert , value.isOpen)
  }

  formatDate(postedon: string): string {
    return this.utilsvc.formatDateISOStringToLegible(postedon)
  }

  async retrieveAccountRequests(){
    try {
      //aquí me interesan las accounts a las que yo se lo he pedido
      const res = await this.restSvc.getJoinChainRequests(this.userdata!.userid);
      if (res.code === 0) {
        const joinRequests: { requestingUserid: string, requestedUserid: string, requestedAt: Date }[] = res.userdata.reqs;
        const joinRequestings: { requestingUserid: string, requestedUserid: string, requestedAt: Date }[] = res.others.reqs;

        if (joinRequests.length > 0) {
          let reqIndex = joinRequests.findIndex(req => req.requestedUserid === this.linxdata?.userid)
          if (reqIndex !== -1) {
            this.isChainRequested.set(true)
          } else {
            this.isChainRequested.set(false)
          }

        } else {
          this.isChainRequested.set(false)
        }

        if (joinRequestings.length > 0) {
          let reqIndex = joinRequestings.findIndex(req => req.requestedUserid === this.userdata?.userid)
          if (reqIndex !== -1) {
            this.isChainBeingRequested.set(true)
          } else {
            this.isChainBeingRequested.set(false)
          }
        } else {
          this.isChainBeingRequested.set(false)
        }

      } else {
        console.log('error getting join chain reqs ...', res.error)
      }
    } catch (error) {
      console.log('error getting join chain reqs ...', error)
    }

  }

  ngOnInit(){
    if (isPlatformBrowser(this.platformId)) {
      initFlowbite();
    }
    this.retrieveAccountRequests();
  }

  loadProfileArticles() {

    let sortedArticles: IArticle[] = [];
    this.articles = [];

    if (this.isCandidate()) {
      sortedArticles = this.utilsvc.sortArticlesDateDESC(this.candidateData.account.articles !== undefined ? this.candidateData.account.articles! : [])
      this.articles = sortedArticles;
      return;
    } 
    if (this.isUser()) {
      sortedArticles = this.utilsvc.sortArticlesDateDESC(this.userdata?.account.articles !== undefined ? this.userdata?.account.articles : [])
      this.articles = sortedArticles;
      return;
    }
    if(this.isChained() || this.isMatch()){
      sortedArticles = this.utilsvc.sortArticlesDateDESC(this.linxdata?.articles !== undefined ? this.linxdata.articles! : [])
      this.articles = sortedArticles;
      return;
    } 

  }

  ngAfterViewInit(): void {
    initTooltips();
    this.loadingArts.set(true);
    this.loadProfileArticles()
    this.ref.detectChanges();
    this.loadingArts.set(false);
  }

  ngOnDestroy(): void {
    this.signalStoreSvc.StoreCandidateData(null);
    this.signalStoreSvc.StoreCandidateData(null);
  }

  logout() {
    this.signalStoreSvc.StoreUserData(null);
    this.signalStoreSvc.StoreJWT(null);
    this.signalStoreSvc.RemoveRoomKeys();
    this.socketsvc.disconnect();
    this.router.navigateByUrl('/Linx/Login');
  }

  //_________ BUILT 

  groupMyLinxsOnChains (){
    const myLinxs: IAccount[] = this.signalStoreSvc.RetrieveMyLinxs()()!;
    const linxMap: Map<string, IAccount> = new Map();
  
    // Inicializo las cadenas 
    this.userdata?.account.myChains?.forEach(chain => {
      this.myChains.push({ chainid: chain.chainid, chainname: chain.chainname, createdAt: chain.createdAt, linxs: [] });
    });
  
    myLinxs.forEach(linx => {
      linxMap.set(linx.userid, linx);
    });
  
    // Agrupo lxs linxs en las cadenas correspondientes
    this.userdata?.account.myLinxs?.forEach(linx => {
      const chain = this.myChains.find(chain => chain.chainid === linx.chainid);
      const linxData = linxMap.get(linx.userid);
  
      if (chain && linxData) {
        chain.linxs.push(linxData);
      }
    });
  }

  retrieveSharedChains (){

    let myLinxs : IAccount[] = this.signalStoreSvc.RetrieveMyLinxs()()!;
    let chainIDs : Set<string> = new Set<string>();
    let linxMap :  Map<string, string> = new Map<string,string>();

    // Recojo los chainids que compartimos este Linx y yo
    this.userdata?.account.myLinxs?.forEach(li => {
      if(li.userid === this.linxdata?.userid){
        chainIDs.add(li.chainid)
      }
    })

    // Almaceno las cadenas compartidas 
    this.sharedChains = this.userdata?.account.myChains
    ?.filter(chain => chainIDs.has(chain.chainid))
    .map(chain => ({ chainid: chain.chainid, chainname: chain.chainname, linxs: [] })) || [];

    // Mapeao cada linx con su chainid 
    this.userdata?.account.myLinxs?.forEach(linx => {
      if (chainIDs.has(linx.chainid)) {
        linxMap.set(linx.userid, linx.chainid);
      }
    });

    //Añado las cuentas completas de les linxs a las cadenas compartidas
    myLinxs.forEach(linx => {
      const chainid = linxMap.get(linx.userid);
      if (chainid) {
        const index = this.sharedChains.findIndex(cha => cha.chainid === chainid);
        if (index !== -1) {
          this.sharedChains[index].linxs.push(linx);
        }
      }
    });

    
  }

}
