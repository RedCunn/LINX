import { Signal, WritableSignal, signal } from "@angular/core";
import { IUser } from "./userprofile/IUser";
import { IAccount } from "./useraccount/IAccount";
import { IMessage } from "./chat/IMessage";
import { IMatch } from "./userprofile/IMatch";
import { IChainGroup } from "./userprofile/IChainGroup";

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

    StoreMatches (matches : IMatch[] | null) : void;
    RetrieveMatches () : WritableSignal<IMatch[] | null>;

    StoreMatchesAccounts (matches : IAccount[] | null) : void;
    RetrieveMatchesAccounts () : WritableSignal<IAccount[] | null>;

    StoreRoomKeys (rooms : Map<string,string> | null) : void ;
    StoreRoomKey (userRoom : {userid : string , roomkey : string}) : void;
    RetrieveRoomKeys () : WritableSignal<Map<string,string> | null>;

    StoreCandidateIndex (index : number) : void;
    RetrieveCandidateIndex() : WritableSignal<number>;

    //#region ---------------NEW AND OLD ----------------

    //NEW : 

    StoreGroupedLinxs ( chaingroups : IChainGroup[] | null) : void;
    RetrieveGroupedLinxs () : WritableSignal<IChainGroup[] | null>; 

    StoreMyLinxs ( mylinxs : IAccount[] | null) : void;
    RetrieveMyLinxs () : WritableSignal<IAccount[] | null>;

    //#endregion

    //#endregion

    //#region ---------------------------- [ ASYNC ] --------------------


    //#endregion
}