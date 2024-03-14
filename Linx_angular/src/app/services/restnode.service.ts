import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRestMessage } from '../models/restmessage';
import { Observable, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestnodeService {

  constructor(private _httpClient : HttpClient) { }

  //#region -------------- MEDIA ZONE -------------------------------------------

  public async searchFilms (searchQ : string){

  }

  public trackUserLocationGoogleGeocode(lat : number , long : number) : Promise<IRestMessage>{

    const _obs = this._httpClient.get<IRestMessage>(`http://localhost:3000/api/Account/trackLocationGeocode?lat=${lat}&long=${long}`) as Observable<IRestMessage>;
    return lastValueFrom(_obs);

  }
  //#endregion
}
