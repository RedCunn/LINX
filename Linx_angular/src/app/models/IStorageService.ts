import { Signal, WritableSignal, signal } from "@angular/core";
import { IUser } from "./userprofile/IUser";
import { IAccount } from "./useraccount/IAccount";
import { IMessage } from "./chat/IMessage";
import { IMatch } from "./userprofile/IMatch";

export interface IStorageService {
    //#region ---------------------------- [ SYNC ] --------------------

    StoreUserData (newstate : IUser | null) : void ;
    StoreJWT (jwt : string | null) : void ;

    RetrieveUserData () : WritableSignal<IUser | null> ;
    RetrieveJWT () : Signal<string | null>;

    StoreLinxData (newstate : IAccount | null) : void ;
    RetrieveLinxData () : WritableSignal<IAccount | null> ;

    StoreMyChain (mychain : IAccount[]) : void;
    RetrieveMyChain () : WritableSignal<IAccount[]>;

    StoreMatches (matches : IMatch[]) : void;
    RetrieveMatches () : WritableSignal<IMatch[]>;

    StoreMatchesAccounts (matches : IAccount[]) : void;
    RetrieveMatchesAccounts () : WritableSignal<IAccount[]>;
    //#endregion

    //#region ---------------------------- [ ASYNC ] --------------------


    //#endregion
}