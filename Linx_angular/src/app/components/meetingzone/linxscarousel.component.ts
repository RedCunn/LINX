import { Component, OnInit, inject, signal } from '@angular/core';
import { Carousel, initCarousels, initFlowbite } from 'flowbite';
import { RestnodeService } from '../../services/restnode.service';
import { SignalStorageService } from '../../services/signal-storage.service';
import { IUser } from '../../models/userprofile/IUser';
import { IRestMessage } from '../../models/IRestMessage';
import { Router } from '@angular/router';
import { IAccount } from '../../models/useraccount/IAccount';
import { WebsocketService } from '../../services/websocket.service';
import { IArticle } from '../../models/useraccount/IArticle';

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

  public userdata!: IUser | null;
  public candidateProfiles!: IAccount[] | null;

  public loading = signal(true);
  public currentIndex = signal(0);

  constructor(private router: Router) {
    let _userdata = this.signalStoreSvc.RetrieveUserData();
    if (_userdata() !== null) {
      this.userdata = _userdata();
    }
  }

  async setCandidateProfiles() {
    try {
      const response: IRestMessage = await this.restsvc.shuffleCandidateProfiles(this.userdata?.userid!);
      if (response.code === 0) {
        
        const accountsArticles = response.userdata;
        // Crear un objeto para almacenar los artículos agrupados por userid
        let articlesByUserid: { [key: string]: IArticle[] } = {};

        accountsArticles.forEach((art : IArticle)=> {
          if (!articlesByUserid[art.userid!]) {
            articlesByUserid[art.userid!] = [];
          }
          articlesByUserid[art.userid!].push(art);
        })
        let _accounts = response.others as IAccount[];
        _accounts.forEach(acc => {
          if (acc.articles !== undefined && acc.articles.length > 0) {
            acc.articles = [];
            acc.articles = articlesByUserid[acc.userid] || [];
            const profilePicArticleIndex = articlesByUserid[acc.userid].findIndex(article => article.useAsProfilePic === true);
            if (profilePicArticleIndex !== -1) {
              const profilePicArticle = acc.articles.splice(profilePicArticleIndex, 1)[0];
              acc.articles.unshift(profilePicArticle);
            }
          }
        })
        this.candidateProfiles = _accounts;
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

  nextProfile() {
    if (this.currentIndex() < this.candidateProfiles?.length! - 1) {
      this.currentIndex.update((i) => i + 1);
    } else {
      this.currentIndex.set(0);
    }

  }
  previousProfile() {
    if (this.currentIndex() > 0) {
      this.currentIndex.update((i) => i - 1);
    } else {
      this.currentIndex.set(this.candidateProfiles?.length! - 1);
    }
  }

  async matchRequest(linx: IAccount) {
    try {
      const res = await this.restsvc.requestMatch(this.userdata?.userid!, linx.userid);
      if (res.code === 0) {
        let index = this.candidateProfiles!.findIndex(profile => profile.userid === linx.userid);
        if (index !== -1) {
          this.candidateProfiles!.splice(index, 1);
        }
        console.log('RESPONSE MATCH REQ : ', res)
        if (res.message === 'FULL') {
          this.socketsvc.linxmatch(linx.userid, this.userdata?.userid!, this.userdata?.account!, linx);
        }
      } else {
        console.log('RESPONSE ERROR MATCH REQ : ', res)
      }
    } catch (error) {
      console.log('ERROR MATCH REQ : ', error)
    }
  }
  goToLinxProfile(linx : IAccount){
    this.signalStoreSvc.StoreLinxData(linx);
    this.router.navigateByUrl(`/Linx/Profile/${linx.linxname}`);
  }
  async ngOnInit(): Promise<void> {
    initCarousels();
    await this.setCandidateProfiles();
  }
}
