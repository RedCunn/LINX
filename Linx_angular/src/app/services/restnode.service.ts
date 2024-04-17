import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRestMessage } from '../models/IRestMessage';
import { Observable, lastValueFrom } from 'rxjs';
import { IUser } from '../models/userprofile/IUser';
import { IArticle } from '../models/useraccount/IArticle';

@Injectable({
  providedIn: 'root'
})
export class RestnodeService {

  constructor(private _httpClient : HttpClient) { }

  //#region -------------- SIGN UP -------------------------------------------

  public trackUserLocationGoogleGeocode(lat : number , long : number) : Promise<IRestMessage>{

    const _obs = this._httpClient.get<IRestMessage>(`http://localhost:3000/api/Account/trackLocationGeocode?lat=${lat}&long=${long}`) as Observable<IRestMessage>;
    return lastValueFrom(_obs);

  }

  public signupNewUser (newuser : IUser) : Promise<IRestMessage>{
   const _obs = this._httpClient.post<IRestMessage>("http://localhost:3000/api/Account/signup",
   newuser,
   {
    headers: new HttpHeaders({'Content-Type' : 'application/json'})
   }
   )
   return lastValueFrom(_obs);
  }
  //#endregion

  //#region ----------------------- SIGN IN -----------------------------------

  public signin(credentials: { emailorlinxname: string, password: string }) : Promise<IRestMessage>{

    const _obs = this._httpClient.post<IRestMessage>("http://localhost:3000/api/Matching/signin",
      credentials,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      });

    return lastValueFrom(_obs);
  }

  //#endregion

  //#region ---------------------- UPDATE PROFILE -------------------------------

  public uploadArticle (content : {userid : string , article : IArticle}) : Promise<IRestMessage>{
    const _obs = this._httpClient.post<IRestMessage>("http://localhost:3000/api/Profile/uploadArticle",
      content,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      });

    return lastValueFrom(_obs);
  }

  //#endregion
}
