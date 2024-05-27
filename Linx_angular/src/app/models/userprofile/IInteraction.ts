import { IAccount } from "../useraccount/IAccount";
import { IEvent } from "../useraccount/IEvent";

export interface IInteraction {
    matchingAccount? : IAccount[];
    chainedAccount? : IAccount[];
    newEvent? : IEvent[];
    requestedChain? : {account : IAccount, daysOfRequest :number}[];
    brokenChain? : string;
}