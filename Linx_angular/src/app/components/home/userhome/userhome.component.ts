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
import { BehaviorSubject, distinctUntilChanged, lastValueFrom } from 'rxjs';
import { WebsocketService } from '../../../services/websocket.service';
import { MyChainComponent } from '../../mychain/mychain.component';
import { UtilsService } from '../../../services/utils.service';
import { ChainsmodalComponent } from './chainsmodal/chainsmodal.component';
import { IChainGroup } from '../../../models/userprofile/IChainGroup';
import { IChainExtents } from '../../../models/userprofile/IChainExtents';
import { ILinxExtent } from '../../../models/userprofile/ILinxExtent';


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
  
  //OLD : va para interactions
  public isChainBeingRequested = signal(false);
  public showBreakChainAlert = signal(false);
  public showChainBeingRequested = signal(false);
  public isChainRequested = signal(false);
  //NEW : 
  public isMyChain = signal(false);
  public isAdminChains = signal(false);
  public isSharedChains = signal(false);
  public chainExtents : Array<IChainExtents> = [];
  public acceptedChainsReq : Array<{chainid : string, accepted : boolean} > = [];
  public sharedChains : Array<IChainGroup> = [];
  public myChains : Array<IChainGroup> = [];
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
          this.showChainRequested(false);
          this.isUser.set(false);
          this.isChained.set(this.isLinx());
          this.isMatch.set(this.isMyMatch());
          this.loadChatComponent();
          if(!this.isMatch() && this.isLinx()){
              this.groupLinxsOnSharedChains();
              this.isMyChain.set(false);
          }
        } else {
          this.isUser.set(true);
          this.getChainExtents(this.userdata?.userid!);
          this.groupLinxsAndExtentsOnChains(this.userdata!);
          this.isMyChain.set(true);
        }

        this.articles = []
        this.loadProfileArticles()
      });
  }
  //#region ----------------- SET UP ----------------------------------------
  
  //_________ NEW BUILT :

  getGroupedLinxsOnChain (){
    if(this.signalStoreSvc.RetrieveGroupedLinxsOnMyChains()() !== null){
      this.myChains = this.signalStoreSvc.RetrieveGroupedLinxsOnMyChains()()!;
    }else{
      this.myChains = []
    }
  }

  groupLinxsOnSharedChains (){
    this.sharedChains = this.utilsvc.groupLinxsInSharedChains(this.userdata! , this.linxdata!)
  }


  //____________________________________

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

  isMyMatch() : boolean{
    const matches = this.signalStoreSvc.RetrieveMatches()();
    let match = matches?.find(m => m.userid_a === this.linxdata?.userid || m.userid_b === this.linxdata?.userid)
    return match !== undefined;
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
    if(this.isUser()){
      this.isMyChain.set(true);
      this.isAdminChains.set(false);
      this.isSharedChains.set(false);
    }else{
      this.isMyChain.set(false);
      this.isAdminChains.set(true);
    }
    this.isChainOpen.update(v => !v);
  }

  togglePickChainModal(){
    this.isPickChainOpen.update(v => !v);
  }

  showChainRequested( isOpen: boolean) {
    this.isChainRequested.set(isOpen);
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

  onJoinChainRequestedAlertChange (isOpen : boolean){
   this.isChainRequested.set(isOpen)
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

  async loadProfileArticles() {

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

    if(this.isMatch()){
      sortedArticles = this.utilsvc.sortArticlesDateDESC(this.linxdata?.articles !== undefined ? this.linxdata?.articles! : [])
      this.articles = sortedArticles;
      return;
    }
    
    
      this.articles = await this.getArticles();
    
    

  }


  

  async getArticles() : Promise<IArticle[]>{
    try {
      const res = await this.restSvc.getAccountArticles(this.linxdata?.userid!);
      console.log('ARTICLES PEDIDOS EN HOME : ', res.userdata)
      if(res.code === 0){
        return res.userdata as IArticle[];
      }else{
        return [];
      }
    } catch (error) {
      console.log('ERROR PIDIENDO ARTICULOS DE PERFIL ; ', error)
      return [];
    }
  }

  //------ NEW ON SINGIN BEFORE : 
  private chainsExtents : IChainExtents[] = [];

  
  async getChainExtents (userid : string){
    try {
      const res = await this.restSvc.getMyChainExtents(userid , null)
      if(res.code === 0){
        const extentsAccounts : IAccount[] = res.others.accounts as IAccount[]
        const extentsArticles : IArticle[] = res.others.articles as IArticle[]
        const wholeExtentsAccounts : IAccount[] = this.utilsvc.putArticleObjectsIntoAccounts(extentsAccounts , extentsArticles);
        const extents : ILinxExtent[] = res.userdata as ILinxExtent[];
        
        extents.forEach(extent => {
          wholeExtentsAccounts.forEach(account => {
            if(extent.userid === account.userid){
              this.chainsExtents.push({linxExtent : extent , extentAccount : account})
            }
          })
        })
        
      }else{
        console.log('ERROR AL RECUPERAR LINXEXTENTS EN SIGNIN : ', res.error)
      }
      
    } catch (error) {
      console.log('ERROR AL RECUPERAR LINXEXTENTS EN SIGNIN : ', error)
    }
  }

  groupLinxsAndExtentsOnChains(user : IUser){
    const admingroups = this.signalStoreSvc.RetrieveAllUserChainsGroupedByAdmin()()!;
    let groupedLinxs : IChainGroup[] = [];


    admingroups.forEach(group => {
        if(group.chainadminID === this.userdata?.userid){
          const chain = this.userdata.account.myChains?.find(chain => chain.chainid === group.chainID)
          const chaingroup : IChainGroup = {chainid : group.chainID , chainname : group.chainName , createdAt : chain?.createdAt , linxsOnChain : group.accounts, linxExtents : []}
          groupedLinxs.push(chaingroup);
        }
    })

    this.myChains = groupedLinxs;
    console.log('GROUPED LINX AND EXTENTS FROM MYCHAINS AT HOME : ', groupedLinxs)
    this.signalStoreSvc.StoreGroupedLinxsOnMyChains(groupedLinxs);
  }

  setExtendedChainKeys (userid : string){
    const extmap = new Map<string,string>();
    this.chainsExtents.forEach(ext => {
      const roomkey = this.utilsvc.generateRoomkey();
      extmap.set(ext.linxExtent.userid , roomkey);
    })
    for (const [key , value] of extmap) {
      this.socketsvc.requestInitChat(key , userid, value)
    }
    this.signalStoreSvc.StoreRoomKeys(extmap);
  }

  //#region ---------------------- COMPONET'S LIFECYCLE --------------------------------
  ngAfterViewInit(): void {
    initTooltips();
    this.loadingArts.set(true);
    this.loadProfileArticles()
    this.ref.detectChanges();
    this.loadingArts.set(false);
  }
  
  ngOnInit(){
    if (isPlatformBrowser(this.platformId)) {
      initFlowbite();
    }
    this.retrieveAccountRequests();
    this.groupLinxsAndExtentsOnChains(this.userdata!)
    this.setExtendedChainKeys(this.userdata!.userid)
  }

  ngOnDestroy(): void {
    this.signalStoreSvc.StoreCandidateData(null);
    this.signalStoreSvc.StoreCandidateData(null);
  }

  logout() {
    this.signalStoreSvc.StoreUserData(null);
    this.signalStoreSvc.StoreJWT(null);
    this.signalStoreSvc.StoreRoomKeys(null);
    this.signalStoreSvc.StoreMatchesAccounts(null);
    this.signalStoreSvc.StoreMyLinxs(null);
    this.signalStoreSvc.StoreGroupedLinxsOnMyChains(null);
    this.signalStoreSvc.StoreMatches(null);
    this.signalStoreSvc.StoreCandidateData(null);
    this.socketsvc.disconnect();
    this.router.navigateByUrl('/Linx/Login');
  }

  //#endregion

}
