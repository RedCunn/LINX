import { Signal, WritableSignal, signal } from "@angular/core";
import { IUser } from "./userprofile/IUser";
import { IAccount } from "./useraccount/IAccount";
import { IMessage } from "./chat/IMessage";

export interface IStorageService {
    //#region ---------------------------- [ SYNC ] --------------------

    StoreUserData (newstate : IUser | null) : void ;
    StoreJWT (jwt : string | null) : void ;

    RetrieveUserData () : WritableSignal<IUser | null> ;
    RetrieveJWT () : Signal<string | null>;

    StoreLinxData (newstate : IAccount | null) : void ;
    RetrieveLinxData () : WritableSignal<IAccount | null> ;

    StoreMyChain (mychain : IAccount[] | null) : void;
    RetrieveMyChain () : WritableSignal<IAccount[] | null>;
    //#endregion

    //#region ---------------------------- [ ASYNC ] --------------------


    //#endregion
}