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

        // Crear un mapa de artículos para un acceso rápido por id
        const articleMap: { [key: string]: IArticle } = {};
          articles.forEach(article => {
            articleMap[article.articleid!] = article;
        });

        // Reemplazar los articleid en accounts con los objetos de artículo correspondientes
        accounts = accounts.map(account => ({
          ...account,
          articles: account.articles
            ? account.articles.map(article => articleMap[article.articleid!] || article) // Sustituir por el objeto artículo o dejar el id si no se encuentra
            : [] 
        }));

        console.log('CHAIN ACCOUNTS : ', accounts)
        this.signalstoresvc.StoreMyChain(accounts);
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
        const matches: { userid_a: string, userid_b: string, roomkey: string }[] = res.userdata;
        matches.forEach(element => {
          this.roomkeys.add(element.roomkey);
        });
      } else {
        console.log('myMATCHA never found...', res.error)
      }
    } catch (error) {
      console.log('myMATCHA never found...', error)
    }
  }


  joinRooms() {
    this.roomkeys.forEach(room => {
      this.socketSvc.initChat(room);
    })
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
      this.joinRooms();
      this.router.navigateByUrl('/Linx/Inicio');
    } else {
      this.loginerrors.update(v => true);
    }

  }

}
