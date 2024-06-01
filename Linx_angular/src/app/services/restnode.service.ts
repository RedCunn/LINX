import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRestMessage } from '../models/IRestMessage';
import { Observable, lastValueFrom } from 'rxjs';
import { IUser } from '../models/userprofile/IUser';
import { IMessage } from '../models/chat/IMessage';

@Injectable({
  providedIn: 'root'
})
export class RestnodeService {

  constructor(private _httpClient: HttpClient) { }

  //#region -------------- ACCOUNTS -------------------------------------------

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

  public signin(credentials: { emailorlinxname: string, password: string }): Promise<IRestMessage> {

    const res = this._httpClient.post<IRestMessage>("http://localhost:3000/api/Account/signin",
      credentials,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      });

    return lastValueFrom(res);
  }

  public authenticate(userid: string, jwt: string, password: string): Promise<IRestMessage> {

    const res = this._httpClient.post<IRestMessage>(`http://localhost:3000/api/Account/${userid}/auth`,
      password,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${jwt}` })
      });

    return lastValueFrom(res);
  }

  public editAccount(userid: string, jwt: string, changes: {linxname : string , email : string}): Promise<IRestMessage> {
    const res = this._httpClient.put<IRestMessage>(`http://localhost:3000/api/Account/${userid}`,
      changes,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${jwt}` })
      });

    return lastValueFrom(res);
  }

  public deleteAccount(userid: string, jwt: string): Promise<IRestMessage> {
    const res = this._httpClient.delete<IRestMessage>(`http://localhost:3000/api/Account/${userid}`,
      {
        headers: new HttpHeaders({ 'Authorization': `Bearer ${jwt}` })
      });

    return lastValueFrom(res);
  }

  public newArticle(userid: string, article: FormData): Promise<IRestMessage> {
    const res = this._httpClient.post<IRestMessage>(`http://localhost:3000/api/Account/${userid}/article`, article);
    return lastValueFrom(res);
  }
  public editArticle(userid: string, artid: string, article: FormData): Promise<IRestMessage> {
    const res = this._httpClient.put<IRestMessage>(`http://localhost:3000/api/Account/${userid}/article/${artid}`, article);
    return lastValueFrom(res);
  }

  public deleteArticle(userid: string, artid: string): Promise<IRestMessage> {
    const res = this._httpClient.delete<IRestMessage>(`http://localhost:3000/api/Account/${userid}/article/${artid}`);
    return lastValueFrom(res);
  }

  public getAccountArticles(userid : string): Promise<IRestMessage>{
    const res = this._httpClient.get<IRestMessage>(`http://localhost:3000/api/Account/${userid}/articles`);
    return lastValueFrom(res);
  }

  //#endregion

  //#region ------------------------------ PROFILE -----------------------------------------

  public editProfileData(userid : string , data : Object): Promise<IRestMessage>{
    const res = this._httpClient.put<IRestMessage>(`http://localhost:3000/api/Profile/${userid}/data`, data);
    return lastValueFrom(res);
  }

  public editProfilePreferences(userid : string , preferences : Object): Promise<IRestMessage>{
    const res = this._httpClient.put<IRestMessage>(`http://localhost:3000/api/Profile/${userid}/preferences`, preferences);
    return lastValueFrom(res);
  }

  //#endregion

  //#region -------------------------- MATCHING ----------------------------------------

  public shuffleCandidateProfiles(userid: string): Promise<IRestMessage> {
    const res = this._httpClient.get<IRestMessage>(`http://localhost:3000/api/Match/${userid}/shuffledProfiles`)
    return lastValueFrom(res);
  }

  public requestMatch(userid: string, linxuserid: string): Promise<IRestMessage> {
    const res = this._httpClient.post<IRestMessage>(`http://localhost:3000/api/Match/${userid}/${linxuserid}`,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      })

    return lastValueFrom(res);
  }

  public getPlaceDetails (cityid : string) : Promise<IRestMessage>{
    const res = this._httpClient.get<IRestMessage>(`http://localhost:3000/api/Account/places/${cityid}`);
    return lastValueFrom(res);
  }
  //#endregion

  //#region ----------------------------- MY CHAIN --------------------------------

  public getMyChain(userid: string): Promise<IRestMessage> {
    const res = this._httpClient.get<IRestMessage>(`http://localhost:3000/api/Chain/${userid}`);
    return lastValueFrom(res);
  }

  public getExtendedChain(userid: string, mylinxuserid: string): Promise<IRestMessage> {
    const res = this._httpClient.get<IRestMessage>(`http://localhost:3000/api/Chain/${userid}/extendedchain/${mylinxuserid}`);
    return lastValueFrom(res);
  }

  public requestJoinChain(userid: string, linxuserid: string): Promise<IRestMessage> {
    const res = this._httpClient.post<IRestMessage>(`http://localhost:3000/api/Chain/${userid}/${linxuserid}`,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }
    );
    return lastValueFrom(res);
  }

  public getJoinChainRequests(userid: string) {
    const res = this._httpClient.get<IRestMessage>(`http://localhost:3000/api/Chain/${userid}/chainreqs`);
    return lastValueFrom(res);
  }

  public breakChain(userid: string, linxuserid: string) {
    const res = this._httpClient.delete<IRestMessage>(`http://localhost:3000/api/Chain/${userid}/mychain/${linxuserid}`);
    return lastValueFrom(res);
  }

  public rejectJoinChainRequest(userid: string, linxuserid: string) {
    const res = this._httpClient.delete<IRestMessage>(`http://localhost:3000/api/Chain/${userid}/chainreq/${linxuserid}`);
    return lastValueFrom(res);
  }

  //#endregion

  //#region ----------------------------- MY INTERACTIONS ------------------------

  public getMyMatches(userid: string): Promise<IRestMessage> {
    const res = this._httpClient.get<IRestMessage>(`http://localhost:3000/api/Match/${userid}/matches`);
    return lastValueFrom(res);
  }

  public getMatchRoomKey(userid_a: string, userid_b: string): Promise<IRestMessage> {
    const res = this._httpClient.get<IRestMessage>(`http://localhost:3000/api/Match/${userid_a}/${userid_b}/roomkey`);
    return lastValueFrom(res);
  }

  public unMatch(userid : string , matchuserid : string): Promise<IRestMessage>{
    const res = this._httpClient.delete<IRestMessage>(`http://localhost:3000/api/Match/${userid}/match/${matchuserid}`);
    return lastValueFrom(res);
  }

  //#endregion

  //#region -------------------------------- CHAT ---------------------------------
  public getMyChats(roomkey: string | null, userid: string): Promise<IRestMessage> {
    
    const  res = this._httpClient.get<IRestMessage>(`http://localhost:3000/api/Account/${userid}/chat/${roomkey}`);
    return lastValueFrom(res);
  }

  public storeMessage(chat: { participants: { userid_a: string, userid_b: string }, message: IMessage }, roomkey: string): Promise<IRestMessage> {
    const res = this._httpClient.put<IRestMessage>(`http://localhost:3000/api/Account/chat/${roomkey}`,
      chat,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      })

    return lastValueFrom(res);
  }
  //#endregion
}
