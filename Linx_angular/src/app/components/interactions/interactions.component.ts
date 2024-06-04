import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { RestnodeService } from '../../services/restnode.service';
import { SignalStorageService } from '../../services/signal-storage.service';
import { IUser } from '../../models/userprofile/IUser';
import { IAccount } from '../../models/useraccount/IAccount';
import { Router } from '@angular/router';
import { WebsocketService } from '../../services/websocket.service';
import { Subject, takeUntil } from 'rxjs';
import { IInteraction } from '../../models/userprofile/IInteraction';
import { IEvent } from '../../models/useraccount/IEvent';
import { IArticle } from '../../models/useraccount/IArticle';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-interactions',
  standalone: true,
  imports: [],
  templateUrl: './interactions.component.html',
  styleUrl: './interactions.component.css'
})
export class InteractionsComponent implements OnInit, OnDestroy {

  @Input() isOpen = signal(false)

  closeModal() {
    this.isOpen.set(false);
  }

  private restSvc = inject(RestnodeService);
  private signalStorageSvc = inject(SignalStorageService);
  private websocketsvc = inject(WebsocketService);
  private utilsvc = inject(UtilsService);
  private router = inject(Router);

  private _user!: IUser | null;
  public myMatches!: IAccount[] | null;
  public joinChainReqs : {requestingUserid : string , requestedUserid : string , requestedAt : Date} [] = []; 

  private destroy$ = new Subject<void>();
  public interactions: IInteraction = { matchingAccount: [], chainedAccount: [], newEvent: [], requestedChain: [] };

  public currentDate : Date = new Date();

  public signalOpenUnMatchAlert = signal<{[key : string]: boolean}>({});
  private setUnMatchAlertOpen : {[key : string]: boolean} = {};

  constructor(private ref: ChangeDetectorRef) {
    this.websocketsvc.getInteractions().pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => {
      switch (data.type) {
        case 'match':
          console.log('FULL MATCH :::::::::::::::::', data.interaction)
          let accountInteracting = data.interaction as IAccount
          this.interactions.matchingAccount!.unshift(accountInteracting);
          this.interactions.matchingAccount?.forEach(acc => {
            if(!this.setUnMatchAlertOpen[acc.userid]){
              this.setUnMatchAlertOpen[acc.userid] = false
            }
          })
          this.signalOpenUnMatchAlert.set(this.setUnMatchAlertOpen)
          this.ref.detectChanges();
          break;
        case 'chain':
          console.log('CHAINED :::::::::::::::::', data.interaction)
          this.interactions.chainedAccount!.unshift(data.interaction as IAccount);
          this.ref.detectChanges();
          break;
        case 'reqchain':
          console.log('REQUESTED CHAIN :::::::::::::::::', data.interaction)
          this.interactions.requestedChain!.unshift({account : data.interaction as IAccount, daysOfRequest : 0});
          this.ref.detectChanges();
          break;
        case 'event':
          this.interactions.newEvent!.unshift(data.interaction as IEvent);
          this.ref.detectChanges();
          break;
        default:
          break;
      }

    });
  }

  goToProfile(profile: IAccount) {
    this.signalStorageSvc.StoreCandidateData(null);
    this.isOpen.set(false);
    this.signalStorageSvc.StoreLinxData(profile);
    this.router.navigateByUrl(`/Linx/Profile/${profile.linxname}`);
  }

  showUnMatchAlert(isOpen : boolean, userid : string){
    this.setUnMatchAlertOpen[userid] = isOpen;
    this.signalOpenUnMatchAlert.set(this.setUnMatchAlertOpen);
  }

  async unMatch(matchuserid : string){
    try {
      const res = await this.restSvc.unMatch(this._user?.userid! , matchuserid)
      if(res.code === 0){
       console.log('Undone Match : ', res.message)
       const delindex = this.interactions.matchingAccount?.findIndex(acc => acc.userid === matchuserid)
       if (delindex !== -1 && delindex !== undefined) {
        this.interactions.matchingAccount?.splice(delindex, 1);
      }  
      }else{
        console.log('Error undoing match ....', res.error)
      }
    } catch (error) {
      console.log('Error undoing match ....', error)
    }
  }

  getMatches(){
    try {
        this.myMatches = this.signalStorageSvc.RetrieveMatchesAccounts()();
    } catch (error) {
      console.log('interactions MATCHES never found...', error)
    }
  }

  async getJoinChainRequests(){
    try {
      // aqui me interesan las accounts que me los están pidiendo a mí
      const res = await this.restSvc.getJoinChainRequests(this._user?.userid!);
      if(res.code === 0){
        const requestingaccounts = res.others.accounts;
        const chainreques = res.others.reqs;
        const articles = res.others.articles;
        console.log('JOIN REQS : ', res.userdata)
        return {accounts : requestingaccounts , requests : chainreques , articles : articles};
      }else{
        console.log('interactions JOINCHAIN REQS never found...', res.message)
        return null;
      }
    } catch (error) {
       console.log('interactions JOINCHAIN REQS never found...', error)
       return null;
    }
  }

  getNewOnChains (){
    const tenDaysAgo = new Date(this.currentDate);
    tenDaysAgo.setDate(this.currentDate.getDate() - 10);
    const signalchain = this.signalStorageSvc.RetrieveMyChain()()!;
    
    const linxson = this._user?.account.myChain;

    let filteredLinxsOn = linxson?.filter(c => {
                          const date = new Date(c.chainedAt)
                          return date <= tenDaysAgo;
                        });

    const linxsonUserIds = filteredLinxsOn?.map(c => c.userid);

    const newOnChains = signalchain?.filter(acc => linxsonUserIds?.includes(acc.userid));

    return newOnChains;    
  }

  async getMyInteractions() {
    this.getMatches();
    if(this.myMatches !== null){
      this.myMatches.forEach(element => {
        this.interactions.matchingAccount!.push(element);
      });
    }

    const joinchainreq = await this.getJoinChainRequests();
    const reqaccounts : IAccount[]= joinchainreq?.accounts!;
    const accountsarticles : IArticle[] = joinchainreq?.articles;
    const wholeRequestingAccounts = this.utilsvc.putArticleObjectsIntoAccounts(reqaccounts , accountsarticles)
    
    this.joinChainReqs = joinchainreq?.requests;

    wholeRequestingAccounts.forEach(element => {
      let dateOfReq = this.joinChainReqs
        .filter(r => r.requestingUserid === element.userid)
        .map(r => r.requestedAt)[0]; 
      const dateType = new Date(dateOfReq);
      const differenceInTime = this.currentDate.getTime() - dateType.getTime();
      const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
      this.interactions.requestedChain!.push({ account: element,daysOfRequest : differenceInDays });
    });
    const newOnChains = this.getNewOnChains()
    newOnChains?.forEach(element => {
      this.interactions.chainedAccount?.push(element)
    })
  }

  async ngOnInit(): Promise<void> {
    this._user = this.signalStorageSvc.RetrieveUserData()();
    await this.getMyInteractions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
