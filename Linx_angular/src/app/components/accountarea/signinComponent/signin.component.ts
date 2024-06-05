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

  goToSignup() {
    this.router.navigateByUrl('/Linx/Registro');
  }

  async getFullChain(user: IUser) {
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

  async setExtendedChainKeys (user : IUser){
    const extmap = new Map<string,string>();

    try {
      const res = await this.restSvc.getMyChainExtents(user.userid , null)

      if(res.code === 0){
        const extents : IAccount[] = res.others.accounts as IAccount[]

        extents.forEach(ext => {
          const roomkey = this.utilsvc.generateRoomkey();
          extmap.set(ext.userid , roomkey);
        })

        for (const [key , value] of extmap) {
          this.socketSvc.requestInitChat(key , user.userid, value)
        }
        this.signalstoresvc.StoreRoomKeys(extmap);

      }else{
        console.log('ERROR AL RECUPERAR LINXEXTENTS EN SIGNIN : ', res.error)
      }
      
      
    } catch (error) {
      console.log('ERROR AL RECUPERAR LINXEXTENTS EN SIGNIN : ', error)
    }
  }

  async Signin(loginForm: NgForm) {

    const _response: IRestMessage = await this.restSvc.signin({ emailorlinxname: loginForm.control.get('emailorlinxname')?.value, password: loginForm.control.get('password')?.value });

    if (_response.code === 0) {
      const user: IUser = _response.userdata;
      user.account.articles = _response.others;
      this.signalstoresvc.StoreUserData(user);
      this.signalstoresvc.StoreJWT(_response.token!);
      this.socketSvc.connect();
      this.socketSvc.initUserRoom(user.userid);
      await this.getFullChain(user)
      await this.getMyMatches(user.userid)
      this.setExtendedChainKeys(user)
      this.socketSvc.userLogin(user.account._id!, user.account.linxname);
      this.utilsvc.joinRooms(this.userRooms);
      this.router.navigateByUrl('/Linx/Inicio');
    } else {
      this.loginerrors.update(v => true);
    }

  }

}
