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

    StoreLinxData (newstate : IAccount| null) : void ;
    RetrieveLinxData () : WritableSignal<IAccount| null> ;

    StoreCandidateData (newstate : IUser | null) : void ;
    RetrieveCandidateData () : WritableSignal<IUser | null> ;

    StoreMyChain (mychain : IAccount[] | null) : void;
    RetrieveMyChain () : WritableSignal<IAccount[] | null>;

    StoreMatches (matches : IMatch[] | null) : void;
    RetrieveMatches () : WritableSignal<IMatch[] | null>;

    StoreMatchesAccounts (matches : IAccount[] | null) : void;
    RetrieveMatchesAccounts () : WritableSignal<IAccount[] | null>;

    StoreRoomKeys (userRoom : {userid : string , roomkey : string}) : void;
    RetrieveRoomKeys () : WritableSignal<Map<string,string> | null>;

    StoreCandidateIndex (index : number) : void;
    RetrieveCandidateIndex() : WritableSignal<number>;
    //#endregion

    //#region ---------------------------- [ ASYNC ] --------------------


    //#endregion
}