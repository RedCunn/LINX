import { Signal, WritableSignal, signal } from "@angular/core";
import { IUser } from "./userprofile/IUser";

export interface IStorageService {
    //#region ---------------------------- [ SYNC ] --------------------

    StoreUserData (newstate : IUser | null) : void ;
    StoreJWT (jwt : string | null) : void ;

    RetrieveUserData () : WritableSignal<IUser | null> ;
    RetrieveJWT () : Signal<string | null>;

    //#endregion

    //#region ---------------------------- [ ASYNC ] --------------------


    //#endregion
}