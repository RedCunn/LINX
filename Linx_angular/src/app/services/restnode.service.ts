import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRestMessage } from '../models/IRestMessage';
import { Observable, lastValueFrom } from 'rxjs';
import { IUser } from '../models/userprofile/IUser';
import { IArticle } from '../models/useraccount/IArticle';
import { IMessage } from '../models/chat/IMessage';

@Injectable({
  providedIn: 'root'
})
export class RestnodeService {

  constructor(private _httpClient: HttpClient) { }

  //#region -------------- SIGN UP -------------------------------------------

  public trackUserLocationGoogleGeocode(lat: number, long: number): Promise<IRestMessage> {

    const res = this._httpClient.get<IRestMessage>(`http://localhost:3000/api/Account/trackLocationGeocode?lat=${lat}&long=${long}`) as Observable<IRestMessage>;
    return lastValueFrom(res);

  }

  public signupNewUser(newuser: IUser): Promise<IRestMessage> {
    const res = this._httpClient.post<IRestMessage>("http://localhost:3000/api/Account/signup",
      newuser,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }
    )
    return lastValueFrom(res);
  }
  //#endregion

  //#region ----------------------- SIGN IN -----------------------------------

  public signin(credentials: { emailorlinxname: string, password: string }): Promise<IRestMessage> {

    const res = this._httpClient.post<IRestMessage>("http://localhost:3000/api/Account/signin",
      credentials,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      });

    return lastValueFrom(res);
  }

  //#endregion

  //#region ---------------------- UPDATE PROFILE -------------------------------

  public newArticle(userid: string, article: IArticle): Promise<IRestMessage> {
    const res = this._httpClient.post<IRestMessage>(`http://localhost:3000/api/Account/${userid}/article`,
      article,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      });
    return lastValueFrom(res);
  }
  public editArticle(userid: string, article: IArticle): Promise<IRestMessage> {
    const res = this._httpClient.put<IRestMessage>(`http://localhost:3000/api/Account/${userid}/article/${article.artid}`,
      article,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      });
    return lastValueFrom(res);
  }
  //#endregion

  //#region -------------------------- MATCHING ----------------------------------------

  public shuffleCandidateProfiles(userid: string): Promise<IRestMessage> {
    const res = this._httpClient.get<IRestMessage>(`http://localhost:3000/api/Match/${userid}/shuffledProfiles`,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      })

    return lastValueFrom(res);
  }

  public requestMatch(userid: string, linxuserid: string): Promise<IRestMessage> {
    const res = this._httpClient.post<IRestMessage>(`http://localhost:3000/api/Match/${userid}/${linxuserid}`,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      })

    return lastValueFrom(res);
  }
  //#endregion

  //#region ----------------------------- MY CHAIN --------------------------------

  public getMyChain(userid: string): Promise<IRestMessage> {
    const res = this._httpClient.get<IRestMessage>(`http://localhost:3000/api/Chain/${userid}`);
    return lastValueFrom(res);
  }

  public chainLinxs(userid: string, linxuserid: string): Promise<IRestMessage> {
    const res = this._httpClient.post<IRestMessage>(`http://localhost:3000/api/Chain/${userid}/${linxuserid}`,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }
    );
    return lastValueFrom(res);
  }


  //#endregion

  //#region -------------------------------- CHAT ---------------------------------
  public getMyChats(userid: string, jwt: string): Promise<IRestMessage> {
    const res = this._httpClient.get<IRestMessage>(`http://localhost:3000/api/Account/${userid}/chat`,
      {
        headers: new HttpHeaders({ 'Authorization': `Bearer ${jwt}` })
      }
    );
    return lastValueFrom(res);
  }

  public storeMessage(jwt: string, userid: string, chatid: string, message: IMessage) {
    this._httpClient.post(`http://localhost:3000/api/Account/${userid}/chat/${chatid}`,
      message,
      {
        headers: new HttpHeaders({ 'Authorization': `Bearer ${jwt}`, 'Content-Type': 'application/json' })
      })
  }
  //#endregion
}
