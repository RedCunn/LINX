import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
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

  private roomkeys: Set<string> = new Set();
  constructor(private router: Router, private restSvc: RestnodeService) { }

  goToSignup() {
    this.router.navigateByUrl('/Linx/Registro');
  }

  async getMyChain(user: IUser) {
    try {
      const res = await this.restSvc.getMyChain(user.userid);
      if (res.code === 0) {
        let accounts: IAccount[] = res.others as IAccount[];
        const articles: IArticle[] = res.userdata as IArticle[];
        
        //cogemos todas las llaves de las habitaciones
        user.account.myChain?.forEach(c => {
          this.roomkeys.add(c.roomkey);
        })
        const wholeAccounts = this.utilsvc.putArticleObjectsIntoAccounts(accounts, articles);

        this.signalstoresvc.StoreMyChain(wholeAccounts);
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
          this.roomkeys.add(element.roomkey);
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

  async Signin(loginForm: NgForm) {

    // if (loginForm.control.get('emailorlinxname')?.status !== 'VALID') {
    //   this.renderer.setAttribute(this.emailorlinxname.nativeElement, 'style', 'background-color: pink');
    //   return;
    // } else {
    //   this.renderer.setAttribute(this.emailorlinxname.nativeElement, 'style', 'background-color : lightblue');
    // }

    // if (loginForm.control.get('password')?.status !== 'VALID') {
    //   this.renderer.setAttribute(this.password.nativeElement, 'style', 'background-color: pink');
    //   return;
    // } else {
    //   this.renderer.setAttribute(this.password.nativeElement, 'style', 'background-color: lightblue');
    // }

    const _response: IRestMessage = await this.restSvc.signin({ emailorlinxname: loginForm.control.get('emailorlinxname')?.value, password: loginForm.control.get('password')?.value });

    if (_response.code === 0) {
      const user: IUser = _response.userdata;
      user.account.articles = _response.others;
      this.signalstoresvc.StoreUserData(user);
      this.signalstoresvc.StoreJWT(_response.token!);
      this.socketSvc.connect();
      this.socketSvc.initUserRoom(user.userid);
      await this.getMyChain(user)
      await this.getMyMatches(user.userid)
      this.socketSvc.userLogin(user.account._id!, user.account.linxname);
      this.utilsvc.joinRooms(this.roomkeys);
      this.router.navigateByUrl('/Linx/Inicio');
    } else {
      this.loginerrors.update(v => true);
    }

  }

}
