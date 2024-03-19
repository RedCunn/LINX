import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRestMessage } from '../models/restmessage';
import { Observable, lastValueFrom } from 'rxjs';
import { IUser } from '../models/userprofile/user';

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
}
