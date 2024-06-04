import { Injectable, inject } from '@angular/core';
import { IAccount } from '../models/useraccount/IAccount';
import { IArticle } from '../models/useraccount/IArticle';
import { WebsocketService } from './websocket.service';
import { SignalStorageService } from './signal-storage.service';
import { IUser } from '../models/userprofile/IUser';
import { IMatch } from '../models/userprofile/IMatch';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  private socketSvc: WebsocketService = inject(WebsocketService);
  private signalSvc: SignalStorageService = inject(SignalStorageService);

  private currentDate: Date = new Date();

  constructor() { }

  public putArticleObjectsIntoAccounts(accounts: IAccount[], articles: IArticle[]): IAccount[] {
    let articlesByUserid: { [key: string]: IArticle[] } = {};
    let wholeAccounts = accounts;

    articles.forEach(art => {
      if (!articlesByUserid[art.userid!]) {
        articlesByUserid[art.userid!] = [];
      }
      articlesByUserid[art.userid!].push(art);
    })

    wholeAccounts.forEach(acc => {
      if (acc.articles && acc.articles.length > 0) {
        acc.articles = [];
        acc.articles = articlesByUserid[acc.userid] || [];
        const profilePicArticleIndex = articlesByUserid[acc.userid].findIndex(article => article.useAsProfilePic === true);
        if (profilePicArticleIndex !== -1) {
          const profilePicArticle = acc.articles.splice(profilePicArticleIndex, 1)[0];
          acc.articles.unshift(profilePicArticle);
        }
      }
    })
    return wholeAccounts;
  }

  public joinRooms(userRooms: Map<string, string>): void {
    const storedkeys = new Map<string, string>(this.signalSvc.RetrieveRoomKeys()());
    const roomkeysToJoin = new Map<string, string>();

    for (const [key, value] of userRooms) {
      if (storedkeys.get(key) === undefined) {
        roomkeysToJoin.set(key, value);
        this.signalSvc.StoreRoomKeys({ userid: key, roomkey: value })
      }
    }
    for (const [key, value] of roomkeysToJoin) {
      this.socketSvc.initChat(value);
    }
  }

  public integrateAccountsIntoUsers(accounts: IAccount[], users: IUser[]): IUser[] {
    const userMap = new Map<string, IUser>();

    users.forEach(user => {
      userMap.set(user.userid, user);
    });

    accounts.forEach(acc => {
      const user = userMap.get(acc.userid);
      if (user) {
        user.account = acc;
      }
    });

    return Array.from(userMap.values());

  }

  public mapCandidateProfileDataToLegible(profile: IUser): Map<string, string> {
    const attributesMap = new Map<string, string>();

    const birthday = new Date(profile.birthday);
    const yearsOld = this.currentDate.getFullYear() - birthday.getFullYear();

    attributesMap.set('years', yearsOld.toString());

    const dietValue = profile.diet;
    let diet = '';
    switch (dietValue) {
      case "vegan":
        diet = "veganx";
        break;
      case "vegetarian":
        diet = "vegetarianx";
        break;
      case "omnivore":
        diet = "omnivorx";
        break;
      default:
        break;
    }

    attributesMap.set('diet', diet)

    const genderValue = profile.gender;
    let gender = '';

    switch (genderValue) {
      case 'woman':
        gender = 'mujer';
        break;
      case 'fluid':
        gender = 'fluido';
        break;
      case 'nonbin':
        gender = 'no binarie';
        break;
      case 'man':
        gender = 'hombre';
        break;
      default:
        break;
    }

    attributesMap.set('gender', gender)

    const politicsValue = profile.politics;
    let politics = '';
    switch (politicsValue) {
      case 'some-left':
        politics = 'en algún lugar a la izquierda';
        break;
      case 'some-right':
        politics = 'en algún lugar a la derecha';
        break;
      case 'libe-left':
        politics = 'izquierda libertaria';
        break;
      case 'libe-right':
        politics = 'derecha libertaria';
        break;
      case 'autho-left':
        politics = 'izquierda autoritaria';
        break;
      case 'autho-right':
        politics = 'derecha autoritaria';
        break;
      case 'center':
        politics = 'centrocampista';
        break;
      case 'none':
        politics = 'apolítica';
        break;
      default:
        break;
    }

    attributesMap.set('politics', politics)

    const work = profile.work.industry + ' ' + profile.work.other

    attributesMap.set('work', work)

    return attributesMap;
  }

  sortArticlesDateDESC(articles: IArticle[]): IArticle[] {
    const sortedArticles = articles.sort((a, b) => {
      const dateA = new Date(a.postedOn);
      const dateB = new Date(b.postedOn);
      return dateB.getTime() - dateA.getTime();
    });
    return sortedArticles;
  }

  formatDateISOStringToLegible(date: string) {

    let legibleDate = '';
    const dateObj = new Date(date);

    if (dateObj.getFullYear() === this.currentDate.getFullYear() &&
      dateObj.getMonth() === this.currentDate.getMonth() &&
      dateObj.getDate() === this.currentDate.getDate()) {
      return 'Hoy';
    }else{
      const yesterday = new Date(this.currentDate);
      yesterday.setDate(this.currentDate.getDate() - 1);
      
      if (dateObj.getFullYear() === yesterday.getFullYear() &&
          dateObj.getMonth() === yesterday.getMonth() &&
          dateObj.getDate() === yesterday.getDate()) {
          return 'Ayer';
      }
    }

    legibleDate = dateObj.getDate().toString() + ' del ' + (dateObj.getMonth() + 1).toString() +' de '+dateObj.getFullYear().toString()

    return legibleDate;
  }

  findUserIndexOnChain(user : IUser,  id : string) : number{
    if(user.account.myChain !== undefined && user.account.myChain !== null){
      const index = user.account.myChain.findIndex(l => l.userid === id)
      return index;
    }
    return -1;
  }

  findUserIndexOnExtendedChain(extent : IAccount[], id : string) : number{
    if(extent !== undefined){
      const index = extent.findIndex( l => l.userid === id);
      return index;
    }
    return -1;
  }

  findUserIndexOnMatches(matches : IMatch[] | null, userid : string , id : string) : number{
    if(matches !== null){
      const index = matches.findIndex(m => (m.userid_a === userid && m.userid_b === id) || (m.userid_a === id && m.userid_b === userid))
      return index;
    }
    return -1;
  }

}
