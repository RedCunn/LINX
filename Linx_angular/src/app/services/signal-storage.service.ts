import { Injectable, Signal, WritableSignal, signal } from '@angular/core';
import { IStorageService } from '../models/IStorageService';
import { IUser } from '../models/userprofile/IUser';
import { IAccount } from '../models/useraccount/IAccount';
import { IMessage } from '../models/chat/IMessage';

@Injectable({
  providedIn: 'root'
})
export class SignalStorageService implements IStorageService{

  private _userstatesignal : WritableSignal<IUser | null> = signal<IUser | null>(null);
  private _jwtsignal : WritableSignal<string | null> = signal<string | null>('');
  private _linxstatesignal : WritableSignal<IAccount | null> = signal<IAccount | null>(null);
  private _chatMessageSignal : WritableSignal<IMessage|null> = signal<IMessage|null>(null);

  constructor() { }

  StoreLinxData(newstate: IAccount | null): void {
    if(newstate !== null){
      this._linxstatesignal.update((currentstate) => ({...currentstate , ...newstate}))
    }else{
      this._linxstatesignal.set(null);
    }
  }

  RetrieveLinxData(): WritableSignal<IAccount | null> {
    return this._linxstatesignal;
  }

  StoreUserData(newstate: IUser | null): void {
    if(newstate !== null){
      this._userstatesignal.update((currentstate) => ({...currentstate , ...newstate}))
    }else{
      this._userstatesignal.set(null);
    }
  }
  StoreJWT(jwt: string | null): void {
   if(jwt !== null){
    this._jwtsignal.set(jwt);
   }else{
    this._jwtsignal.set(null);
   }
  }

  RetrieveUserData(): WritableSignal<IUser | null> {
   return this._userstatesignal;
  }
  
  RetrieveJWT(): Signal<string | null> {
    return this._jwtsignal;
  }

  StoreChatMessage(newmessage: IMessage | null): void {
    if(newmessage !== null){
      this._chatMessageSignal.update((currentstate) => ({...currentstate , ...newmessage}))
    }else{
      this._chatMessageSignal.set(null);
    }
  }
  RetrieveChatMessage(): WritableSignal<IMessage | null> {
    return this._chatMessageSignal;
  }
}
