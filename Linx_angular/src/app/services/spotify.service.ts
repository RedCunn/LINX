import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IRestMessage } from '../models/restmessage';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  constructor(private _httpClient : HttpClient) { }

  searchTrack(searchQ: string): Observable<IRestMessage> {
    return this._httpClient.get<IRestMessage>(`http://localhost:3000/api/SearchMedia/tracks?q=${searchQ}`);
  }

  
}
