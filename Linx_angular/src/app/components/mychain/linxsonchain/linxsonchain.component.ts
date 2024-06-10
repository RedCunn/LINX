import { Component, Input, ViewChild, ViewContainerRef, inject, signal } from '@angular/core';
import { IAccount } from '../../../models/useraccount/IAccount';
import { Router } from '@angular/router';
import { IUser } from '../../../models/userprofile/IUser';
import { SignalStorageService } from '../../../services/signal-storage.service';
import { IChainGroup } from '../../../models/userprofile/IChainGroup';
import { RestnodeService } from '../../../services/restnode.service';
import { IArticle } from '../../../models/useraccount/IArticle';
import { UtilsService } from '../../../services/utils.service';
import {GroupchatComponent} from '../../chat/groupchat/groupchat.component';
import { IGroupChat } from '../../../models/chat/IGroupChat';

@Component({
  selector: 'app-linxsonchain',
  standalone: true,
  imports: [GroupchatComponent],
  templateUrl: './linxsonchain.component.html',
  styleUrl: './linxsonchain.component.css'
})
export class LinxsonchainComponent {

  @Input() groupChat! : IGroupChat[];
  @Input() isMyChain = signal(false)
  @Input() isSharedChain = signal(false)
  @Input() isAllChains = signal(false)
  @Input() chain! : IChainGroup;
  @Input() group! : IAccount[];
  @Input() isOpen = signal(false);
  @Input() chainName! : string;
  @Input() chainId! : string;

  private signalStorageSvc = inject(SignalStorageService);
  private restsvc = inject(RestnodeService);
  private utilsvc = inject(UtilsService);
  private router = inject(Router);
  public _user! : IUser | null;
  private linxArticles : IArticle[] = [];
  private isChatOpen = signal(false);
  public groupchat: IGroupChat = {conversationname : '',groupParticipants : [], roomkey : '', messages : []};  
  
  @ViewChild('chatContainer', { read: ViewContainerRef, static: true })
  public chatcompoContainer!: ViewContainerRef;

  goToLinxProfile(linx : IAccount){
    this.isOpen.set(false);
    this.signalStorageSvc.StoreCandidateData(null);
    //!INICIAR CHAT si es extent 
    this.signalStorageSvc.StoreLinxData(linx);

    this.router.navigateByUrl(`/Linx/Profile/${linx.linxname}`);
  }

  async getWholeProfile(linxid : string){
    try {
      const res = await this.restsvc.getAccountArticles(linxid);
      if(res.code === 0){
        console.log('En LINXSONCHAIN : ', res.message)
        this.linxArticles = res.userdata as IArticle[];
      }else{
        console.log('Error recuperando articulos en LINXSONCHAIN : ', res.error)
      }
    } catch (error) {
      console.log('Error recuperando articulos en LINXSONCHAIN : ', error)
    }
  }

  closeModal (){
    this.isOpen.set(false);
  }

  toggleChatModal(){
      this.loadChatComponent()
      this.isChatOpen.update(v => !v);
  }

  async loadChatComponent() {
    const viewContainerRef = this.chatcompoContainer;
    viewContainerRef.clear();
    this.setChat();
    const comporef = viewContainerRef.createComponent<GroupchatComponent>(GroupchatComponent);
    comporef.setInput('isOpen', this.isChatOpen);
    comporef.setInput('groupChatRef', this.groupchat);
  }

  setChat(){
    this.groupchat.conversationname = this.chainName;
    this.groupchat.roomkey = this.chainId;
    this.group.forEach(linx => {
      this.groupchat.groupParticipants?.push({userid : linx.userid, linxname : linx.linxname})
    }) 

    const chatIndex = this.groupChat.findIndex(group => group.roomkey === this.chainId)

    if(chatIndex !== -1){
      this.groupChat[chatIndex].messages.forEach(mess => {
        this.groupchat.messages.push(mess)
      })

      this.groupchat.messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }

  }
}
