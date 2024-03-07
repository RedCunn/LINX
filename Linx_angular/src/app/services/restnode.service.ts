import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RestnodeService {

  constructor(private _httpClient : HttpClient) { }

  //#region -------------- MEDIA ZONE -------------------------------------------

  public async searchFilms (searchQ : string){

  }

  //#endregion
}
