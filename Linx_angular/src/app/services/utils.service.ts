import { Injectable, inject } from '@angular/core';
import { IAccount } from '../models/useraccount/IAccount';
import { IArticle } from '../models/useraccount/IArticle';
import { WebsocketService } from './websocket.service';
import { SignalStorageService } from './signal-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  
  private socketSvc: WebsocketService = inject(WebsocketService);
  private signalSvc : SignalStorageService = inject(SignalStorageService);

  constructor() { }

  public putArticleObjectsIntoAccounts(accounts : IAccount[], articles : IArticle[]) : IAccount[]{
    let articlesByUserid: { [key: string]: IArticle[] } = {};
    let wholeAccounts = accounts;
    
    articles.forEach(art =>{
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

  public joinRooms(roomkeys: Set<string>) {
    const storedkeys = new Set<string>(this.signalSvc.RetrieveRoomKeys()());
    const roomkeysToJoin = new Set([...roomkeys].filter(roomkey => !storedkeys.has(roomkey)));
    roomkeysToJoin.forEach(room => {
        this.socketSvc.initChat(room);
    });
}

}
