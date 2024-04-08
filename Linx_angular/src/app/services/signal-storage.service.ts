import { Injectable, Signal, WritableSignal, signal } from '@angular/core';
import { IStorageService } from '../models/IStorageService';
import { IUser } from '../models/userprofile/user';

@Injectable({
  providedIn: 'root'
})
export class SignalStorageService implements IStorageService{

  private _userstatesignal : WritableSignal<IUser | null> = signal<IUser | null>(null);
  private _jwtsignal : WritableSignal<string> = signal<string>('');


  constructor() { }

  StoreUserData(newstate: IUser): void {
    this._userstatesignal.update((currentstate) => ({...currentstate , ...newstate}))
  }
  StoreJWT(jwt: string): void {
    this._jwtsignal.set(jwt);
  }
  RetrieveUserData(): WritableSignal<IUser | null> {
   return this._userstatesignal;
  }
  RetrieveJWT(): Signal<string> {
    return this._jwtsignal;
  }
}
