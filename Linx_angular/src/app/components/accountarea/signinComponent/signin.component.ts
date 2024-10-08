import { Component, ElementRef, OnInit, ViewChild, inject, signal } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IRestMessage } from '../../../models/IRestMessage';
import { RestnodeService } from '../../../services/restnode.service';
import { SignalStorageService } from '../../../services/signal-storage.service';
import { WebsocketService } from '../../../services/websocket.service';
import { IUser } from '../../../models/userprofile/IUser';
import { IAccount } from '../../../models/useraccount/IAccount';
import { IArticle } from '../../../models/useraccount/IArticle';
import { IMatch } from '../../../models/userprofile/IMatch';
import { UtilsService } from '../../../services/utils.service';
import { IChainGroup } from '../../../models/userprofile/IChainGroup';
import { IChainExtents } from '../../../models/userprofile/IChainExtents';
import { ILinxExtent } from '../../../models/userprofile/ILinxExtent';
import { IAdminGroups } from '../../../models/userprofile/IAdminGroups';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {

  private socketSvc: WebsocketService = inject(WebsocketService);
  private signalstoresvc: SignalStorageService = inject(SignalStorageService);
  private utilsvc : UtilsService = inject(UtilsService);

  @ViewChild('emailorlinxname') emailorlinxname!: ElementRef;
  @ViewChild('password') password!: ElementRef;

  public credentials: { emailorlinxname: String, password: String } = { emailorlinxname: '', password: '' };
  public loginerrors = signal(false);

  private userRooms: Map<string,string> = new Map<string,string>();
  constructor(private router: Router, private restSvc: RestnodeService) { }

  private chainsExtents : IChainExtents[] = [];
  private chainGroupsByAdmin : IAdminGroups[] = [];
  private chainRooms :  Map<string,string> = new Map<string,string>();

  goToSignup() {
    this.router.navigateByUrl('/Linx/Registro');
  }

  //#region ---- GETTING ALL MY LINXS WHOLEACCOUNTS, MATCHES-WHOLEACCOUNTS, EXTENTS-WHOLEACCOUNT
  async getAllMyLinxs(user: IUser) {
    try {
      const res = await this.restSvc.getMyLinxs(user.userid, null);
      if (res.code === 0) {
        let accounts: IAccount[] = res.others as IAccount[];
        const articles: IArticle[] = res.userdata as IArticle[];
        user.account.myLinxs?.forEach(c => {
          this.userRooms.set(c.userid, c.roomkey);
        })
        const wholeAccounts = this.utilsvc.putArticleObjectsIntoAccounts(accounts, articles);
        this.signalstoresvc.StoreMyLinxs(wholeAccounts);
      } else {
        console.log('mychain never found...')
      }
    } catch (error) {
      console.log('mychain never found...', error)
    }
  }

  async getMyMatches(userid: string) {
    try {
      const res = await this.restSvc.getMyMatches(userid)
      if (res.code === 0) {
        const matches: IMatch[] = res.userdata;
        this.signalstoresvc.StoreMatches(matches);

        matches.forEach(element => {
          if(element.userid_a === userid){
            this.userRooms.set(element.userid_b ,element.roomkey);
          }else{
            this.userRooms.set(element.userid_a ,element.roomkey);
          }
        });
        
        let accounts : IAccount[] = res.others.accounts as IAccount[];
        const articles : IArticle[] = res.others.articles as IArticle[];

        const myMatches : IAccount[] = this.utilsvc.putArticleObjectsIntoAccounts(accounts, articles);        
        this.signalstoresvc.StoreMatchesAccounts(myMatches);

      } else {
        console.log('myMATCHA never found...', res.error)
      }
    } catch (error) {
      console.log('myMATCHA never found...', error)
    }
  }

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
//#endregion

//#region ---------- GROUPING LINXS & EXTENTS ON CHAINS 
  groupLinxsAndExtentsOnChains(user : IUser){
    const linxaccounts = this.signalstoresvc.RetrieveMyLinxs()()!;
    let groupedLinxs : IChainGroup[] = this.utilsvc.groupMyLinxsOnChains(user, linxaccounts)
    groupedLinxs.forEach(group => {
      this.chainsExtents.forEach(extent => {
        if(group.chainid === extent.linxExtent.chainID){
          group.linxExtents.push(extent)
        }
      })
    })
    this.signalstoresvc.StoreGroupedLinxsOnMyChains(groupedLinxs);
  }

//#endregion

//#region --------------- SETTING ROOMKEYS FOR EXTENTS 
  setExtendedChainKeys (userid : string){
    const extmap = new Map<string,string>();
    this.chainsExtents.forEach(ext => {
      const roomkey = this.utilsvc.generateRoomkey();
      extmap.set(ext.linxExtent.userid , roomkey);
    })
    for (const [key , value] of extmap) {
      this.socketSvc.requestInitChat(key , userid, value)
    }
    this.signalstoresvc.StoreRoomKeys(extmap);
  }

//#endregion


//#region ------ CARGAR TODAS LAS CADENAS DE LAS QUE FORMO PARTE AGRUPADAS POR ADMIN PARA EL ACCESO DESDE LOGGEDHEADER
//!NO CARGO ARTÍCULOS, hay que peedirlos cada vez que el user acceda a uno de sus perfiles 
//!NO INICIALIZO CHATS, tendré que unirme a sala cada vez que visite perfil 
async getAllChainsGroupedByAdmin (userid : string){
  try {
    const res = await this.restSvc.getAllUserChainsGroupedByAdmin(userid)

    if(res.code === 0){
      console.log('GOT ALL USER CHAINs GROUPED BY ADMIN ->> ', res.userdata)
      //RES _> adminGroup = {chainadminID : index.chainadminID , chainName : index.chainName , accounts : []}[]
      this.chainGroupsByAdmin = res.userdata as IAdminGroups[]

      this.chainGroupsByAdmin.forEach(chain => {
        this.chainRooms.set(chain.chainName , chain.chainID);
      })
      this.signalstoresvc.StoreAllUserChainsGroupedByAdmin(this.chainGroupsByAdmin)

    }else{
      console.log('COULDNT GET ALL USER CHAINs GROUPED BY ADMIN...', res.error)
    }
  } catch (error) {
    console.log('COULDNT GET ALL USER CHAINs GROUPED BY ADMIN...', error)
  }
}
//#endregion

  async Signin(loginForm: NgForm) {

    const _response: IRestMessage = await this.restSvc.signin({ emailorlinxname: loginForm.control.get('emailorlinxname')?.value, password: loginForm.control.get('password')?.value });

    if (_response.code === 0) {
      const user: IUser = _response.userdata;
      user.account.articles = _response.others;
      this.signalstoresvc.StoreUserData(user);
      this.signalstoresvc.StoreJWT(_response.token!);

      this.socketSvc.connect();
      this.socketSvc.initUserRoom(user.userid);

      await this.getAllMyLinxs(user)
      await this.getMyMatches(user.userid)
      //!CARGAR EXTENTS E INICIAR ROOMS CUANDO EL USER ACCEDA A LA CADENA COMPARTIDA
      //await this.getChainExtents(user.userid)
      //!CARGAR EN USERHOME 
      //this.groupLinxsAndExtentsOnChains(user)
      //this.setExtendedChainKeys(user.userid)
      await this.getAllChainsGroupedByAdmin(user.userid)
      this.socketSvc.userLogin(user.account._id!, user.account.linxname);
      this.utilsvc.joinRooms(this.userRooms);
      this.utilsvc.joinRooms(this.chainRooms);

      this.router.navigateByUrl('/Linx/Inicio');
    } else {
      this.loginerrors.update(v => true);
    }

  }

}
