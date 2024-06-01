import { Injectable, Signal, WritableSignal, signal } from '@angular/core';
import { IStorageService } from '../models/IStorageService';
import { IUser } from '../models/userprofile/IUser';
import { IAccount } from '../models/useraccount/IAccount';
import { IMessage } from '../models/chat/IMessage';
import { IMatch } from '../models/userprofile/IMatch';

@Injectable({
  providedIn: 'root'
})
export class SignalStorageService implements IStorageService{

  private _userstatesignal : WritableSignal<IUser | null> = signal<IUser | null>(null);
  private _candidatesignal : WritableSignal<IUser | null> = signal<IUser | null>(null);
  private _jwtsignal : WritableSignal<string | null> = signal<string | null>('');
  private _linxstatesignal : WritableSignal<IAccount | null> = signal<IAccount | null>(null);
  private _mychainsignal : WritableSignal<IAccount[]> = signal<IAccount[]>([]);
  private _matchesaccountsignal : WritableSignal<IAccount[]> = signal<IAccount[]>([]);
  private _matchessignal : WritableSignal<IMatch[]> = signal<IMatch[]>([]);
  private _roomkeyssignal : WritableSignal<string[]> = signal<string[]>([]);

  constructor() { }
  StoreCandidateData(newstate: IUser | null): void {
    if(newstate !== null){
      this._candidatesignal.update((currentstate) => ({...currentstate , ...newstate}))
    }else{
      this._candidatesignal.set(null);
    }
  }
  RetrieveCandidateData(): WritableSignal<IUser | null> {
    return this._candidatesignal;
  }
  StoreRoomKeys(keys: string): void {
    this._roomkeyssignal.update((currents) => ([...keys]))
  }
  RetrieveRoomKeys(): WritableSignal<string[]> {
    return this._roomkeyssignal;
  }
  StoreMatches(matches: IMatch[]): void {
    if(matches !== null){
      this._matchessignal.update((currentstate) => ([...matches]))
    }else{
      this._matchessignal.set([]);
    }
  }
  RetrieveMatches(): WritableSignal<IMatch[]> {
    return this._matchessignal;
  }
  StoreMatchesAccounts(matches: IAccount[]): void {
    if(matches !== null){
      this._matchesaccountsignal.update((currentstate) => ([...matches]))
    }else{
      this._matchesaccountsignal.set([]);
    }
  }
  RetrieveMatchesAccounts(): WritableSignal<IAccount[]> {
    return this._matchesaccountsignal;
  }
  
  StoreMyChain(mychain: IAccount[]): void {
    if(mychain !== null){
      this._mychainsignal.update((currentstate) => ([...mychain]))
    }else{
      this._mychainsignal.set([]);
    }
  }
  RetrieveMyChain(): WritableSignal<IAccount[]> {
    return this._mychainsignal;
  }

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

  
  
}
