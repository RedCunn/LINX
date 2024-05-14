import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { UserhomeasideComponent } from '../userhomeaside/userhomeaside.component';
import { MatIcon } from '@angular/material/icon';
import { SignalStorageService } from '../../../services/signal-storage.service';
import { IUser } from '../../../models/userprofile/IUser';
import { initFlowbite, initTooltips} from 'flowbite';
import { IArticle } from '../../../models/useraccount/IArticle';
import { isPlatformBrowser } from '@angular/common';
import { NgForm, FormsModule } from '@angular/forms';
import { RestnodeService } from '../../../services/restnode.service';
import { Event, NavigationEnd, NavigationStart, Router, RouterModule } from '@angular/router';
import { IAccount } from '../../../models/useraccount/IAccount';
import { ChatComponent } from '../../chat/chat.component';
import { IChat } from '../../../models/chat/IChat';
import { ArticlemodalformComponent } from './artmodal/articlemodalform.component';

@Component({
  selector: 'app-userhome',
  standalone: true,
  imports: [UserhomeasideComponent, MatIcon, FormsModule, RouterModule, ChatComponent, ArticlemodalformComponent],
  templateUrl: './userhome.component.html',
  styleUrl: './userhome.component.css'
})
export class UserhomeComponent implements OnInit, AfterViewInit{

  private signalStoreSvc : SignalStorageService = inject(SignalStorageService);
  private restSvc : RestnodeService = inject(RestnodeService);

  public userdata! : IUser |null;
  public linxdata! : IAccount | null;
  public chat! : IChat;
  public isChatOpen = signal(false);
  public isArtFormOpen = signal(false);
  public isUser = signal(false);
  public routePattern: RegExp = new RegExp("/Linx/Profile/[^/]+","g");
  public article : IArticle = {artid : null, title : '', bodycontent : '', img : '', postedOn : '', useAsUserPic : false}


  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router : Router){
    let _userdata = this.signalStoreSvc.RetrieveUserData();
    let _linxdata = this.signalStoreSvc.RetrieveLinxData();
    console.log('USER ', _userdata())
    console.log('LINX ', _linxdata())

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart || event instanceof NavigationEnd) {
        if(event.url.match(this.routePattern)){
          this.isUser.set(false);
          if(_linxdata() !== null){
            this.linxdata = _linxdata();
          }
        }else{
          this.isUser.set(true);
          if(_userdata() !== null){
            this.userdata = _userdata(); 
          }
        }
      }
    })
   
  }

  async toggleChatModal(){
    this.isChatOpen.update(v => !v);

    if(this.isChatOpen()){
     await this.loadChat();
    }
  }

  toggleArtFormModal(){
    this.isArtFormOpen.update(v => !v);
  }

  async loadChat(){

  }
  
  breakChain(){

  }



  logout(){
    this.signalStoreSvc.StoreUserData(null);
    this.signalStoreSvc.StoreJWT(null);
    this.router.navigateByUrl('/Linx/Login');
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      initFlowbite();
    }
  }

  ngAfterViewInit(): void {
    initTooltips();
  }


}
