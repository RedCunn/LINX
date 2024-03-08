import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { IRestMessage } from '../models/restmessage';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  constructor(private _httpClient : HttpClient) { }

  public searchTrack(searchParams : {q : String , type : String}): Promise<IRestMessage> {
    
    const _obs = this._httpClient.get<IRestMessage>(`http://localhost:3000/api/SearchMedia/tracks?q=${searchParams.q}&type=${searchParams.type}`) as Observable<IRestMessage>;
    return lastValueFrom(_obs);
  }

  
}
