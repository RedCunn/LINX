import { Component, Input, OnInit, Signal, inject, signal } from '@angular/core';
import { IAccount } from '../../models/useraccount/IAccount';
import { LinxsonchainComponent } from './linxsonchain/linxsonchain.component';
import { IChainGroup } from '../../models/userprofile/IChainGroup';
import { IAdminGroups } from '../../models/userprofile/IAdminGroups';
import { SignalStorageService } from '../../services/signal-storage.service';
import { IUser } from '../../models/userprofile/IUser';
import { UtilsService } from '../../services/utils.service';
import { IChainExtents } from '../../models/userprofile/IChainExtents';
import { RestnodeService } from '../../services/restnode.service';
import { IGroupChat } from '../../models/chat/IGroupChat';

@Component({
  selector: 'app-mychain',
  standalone: true,
  imports: [LinxsonchainComponent],
  templateUrl: './mychain.component.html',
  styleUrl: './mychain.component.scss'
})
export class MyChainComponent implements OnInit{

  @Input() isOpen = signal(false);
  @Input() isMyChain = signal(false);
  @Input() isAdminGroups = signal(false);
  @Input() isSharedChain = signal(false);
  @Input() myChains? : Array<IChainGroup>;
  @Input() sharedChains ? : Array<IChainGroup>;
  @Input() adminGroups ? : Array<IAdminGroups>;


  private signalsvc = inject(SignalStorageService)
  private restsvc = inject(RestnodeService)
  private utilsvc = inject(UtilsService);

  public user! : IUser ; 
  public isLinxsOnChainOpen = signal(false);
  public chain : IChainGroup = {chainid : '' , chainname : '' ,createdAt : '', linxsOnChain : [], linxExtents : []}
  public group : IAccount[] = [];
  public myLinxs : IAccount[] = [];
  public chainName : string = '';
  public userChains! : IChainGroup;
  public chainId! : string;
  public groupChats : IGroupChat[] = [];

  constructor(){
    console.log('MY CHAINS ON MYCHAINCOMPO : ', this.myChains)
  }

  closeModal() {
    this.isOpen.set(false);
  }

  showLinsOnGroup (adgroup : IAdminGroups){
    this.chainName = adgroup.chainName;
    this.isAdminGroups.set(true);
    this.group = adgroup.accounts;
    this.chainId = adgroup.chainID;
    this.retrieveGroupChat();
    this.isLinxsOnChainOpen.set(true);
  }
  showLinxsOnChain(chain : IChainGroup){
    this.chainName = chain.chainname;
    this.isAdminGroups.set(false);
    this.chain = chain;
    this.isLinxsOnChainOpen.set(true);
  }

  searchAdminNameOnMyLinxs (userid : string) : string{
    let adminname = "";

    if(userid === this.user.userid){
      return "Mis cadenas";
    }

    const linx = this.myLinxs.find(li => li.userid === userid)

    if(linx){
      adminname = linx?.linxname;
    }

    return adminname;
  }

  async retrieveGroupChat(){
    try {
      const res = await this.restsvc.getMyChats( this.user?.userid!, null);
      if(res.code === 0){
        this.groupChats = res.userdata as IGroupChat[];
        console.log('GROUP CHATS ON LINXSONCHAIN : ', this.groupChats)
      }else{
        console.log('ERROR ON RETRIEVING CHATS ON FOOTER ; ', res.error)
      }
     } catch (error) {
      console.log('ERROR ON RETRIEVING CHATS ON FOOTER ; ', error)
     } 
  
  }

  ngOnInit(): void {
    this.user = this.signalsvc.RetrieveUserData()()!;
  }

}
