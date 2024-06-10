import { ChangeDetectorRef, Component, OnInit, inject, signal } from '@angular/core';
import { initCarousels} from 'flowbite';
import { RestnodeService } from '../../services/restnode.service';
import { SignalStorageService } from '../../services/signal-storage.service';
import { IUser } from '../../models/userprofile/IUser';
import { IRestMessage } from '../../models/IRestMessage';
import { Router } from '@angular/router';
import { IAccount } from '../../models/useraccount/IAccount';
import { WebsocketService } from '../../services/websocket.service';
import { IArticle } from '../../models/useraccount/IArticle';
import { UtilsService } from '../../services/utils.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-linxscarousel',
  standalone: true,
  imports: [],
  templateUrl: './linxscarousel.component.html',
  styleUrl: './linxscarousel.component.css'
})
export class LinxscarouselComponent implements OnInit {

  private restsvc: RestnodeService = inject(RestnodeService);
  private signalStoreSvc: SignalStorageService = inject(SignalStorageService);
  private socketsvc: WebsocketService = inject(WebsocketService);
  private utilsvc : UtilsService = inject(UtilsService);

  public userdata!: IUser | null;
  public candidateProfiles!: IUser[] | null;

  public picArticle! : IArticle;

  public loading = signal(true);
  public currentIndex = signal(0);

  constructor(private router: Router) {
    let _userdata = this.signalStoreSvc.RetrieveUserData();
    if (_userdata() !== null) {
      this.userdata = _userdata();
    }
    const index = this.signalStoreSvc.RetrieveCandidateIndex()();
    this.currentIndex.set(index);
  }

  async setCandidateProfiles() {
    try {
      const response: IRestMessage = await this.restsvc.shuffleCandidateProfiles(this.userdata?.userid!);
      console.log('RESPONSE SETTING CANDIDATE PROFILES : ', response)
      if (response.code === 0) {
        
        const _accountsArticles : IArticle[] = response.userdata as IArticle[];
        const _accounts = response.others.accounts as IAccount[];
        if(_accounts.length > 0){
          const wholeAccounts : IAccount[] = this.utilsvc.putArticleObjectsIntoAccounts(_accounts , _accountsArticles)

          const _users = response.others.users as IUser[];
          const wholeUsers : IUser[] = this.utilsvc.integrateAccountsIntoUsers(wholeAccounts , _users);
  
          this.candidateProfiles = wholeUsers;
  
          if(this.candidateProfiles[this.currentIndex()].account.articles !== undefined && this.candidateProfiles[this.currentIndex()].account.articles!.length > 0){
            this.setProfilePicArticle(this.candidateProfiles[this.currentIndex()])
          }
        }else{
          this.candidateProfiles = []; 
        }
        
        this.loading.set(false);
      } else {
        this.loading.set(false);
        this.router.navigateByUrl('/Linx/error');
      }
    } catch (error) {
      this.loading.set(false);
      this.router.navigateByUrl('/Linx/error');
    }
  }

  setProfilePicArticle(candidate : IUser){
    let artindex = candidate.account.articles?.findIndex(art => art.useAsProfilePic === true)
    if(artindex !== -1){
      this.picArticle = candidate.account.articles![artindex!]
    }else{
      this.picArticle = candidate.account.articles!.at(0)!
    }
  }

  nextProfile() {
    if (this.currentIndex() < this.candidateProfiles?.length! - 1) {
      this.setProfilePicArticle(this.candidateProfiles![this.currentIndex() + 1])
      this.currentIndex.update((i) => i + 1);
      this.signalStoreSvc.StoreCandidateIndex(this.currentIndex())
    } else {
      this.setProfilePicArticle(this.candidateProfiles![0])
      this.currentIndex.set(0);
      this.signalStoreSvc.StoreCandidateIndex(this.currentIndex())
    }

  }
  previousProfile() {
    if (this.currentIndex() > 0) {
      this.setProfilePicArticle(this.candidateProfiles![this.currentIndex() - 1])
      this.currentIndex.update((i) => i - 1);
      this.signalStoreSvc.StoreCandidateIndex(this.currentIndex())
    } else {
      this.setProfilePicArticle(this.candidateProfiles![this.candidateProfiles?.length! - 1])
      this.currentIndex.set(this.candidateProfiles?.length! - 1);
      this.signalStoreSvc.StoreCandidateIndex(this.currentIndex())
    }
  }

  async matchRequest(linx: IUser) {
    try {
      const res = await this.restsvc.requestMatch(this.userdata?.userid!, linx.userid);
      if (res.code === 0) {
        let index = this.candidateProfiles!.findIndex(profile => profile.userid === linx.userid);
        if (index !== -1) {
          this.nextProfile()
          this.candidateProfiles!.splice(index, 1);
        }
        console.log('RESPONSE MATCH REQ : ', res)
        if (res.message === 'FULL') {
          this.socketsvc.linxmatch(linx.userid, this.userdata?.userid!, this.userdata?.account!, linx.account);
        }
      } else {
        console.log('RESPONSE ERROR MATCH REQ : ', res)
      }
    } catch (error) {
      console.log('ERROR MATCH REQ : ', error)
    }
  }
  goToLinxProfile(linx : IUser){
    this.signalStoreSvc.StoreCandidateData(linx as IUser);
    this.signalStoreSvc.StoreCandidateIndex(this.currentIndex());
    this.router.navigateByUrl(`/Linx/Profile/${linx.account.linxname}`);
  }
  async ngOnInit(): Promise<void> {
    initCarousels();
    await this.setCandidateProfiles();
  }
}
