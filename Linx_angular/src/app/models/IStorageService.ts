import { Signal, WritableSignal, signal } from "@angular/core";
import { IUser } from "./userprofile/IUser";

export interface IStorageService {
    //#region ---------------------------- [ SYNC ] --------------------

    StoreUserData (newstate : IUser) : void ;
    StoreJWT (jwt : string) : void ;

    RetrieveUserData () : WritableSignal<IUser | null> ;
    RetrieveJWT () : Signal<string>;

    //#endregion

    //#region ---------------------------- [ ASYNC ] --------------------


    //#endregion
}