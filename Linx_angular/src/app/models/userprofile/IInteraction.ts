import { IAccount } from "../useraccount/IAccount";
import { IEvent } from "../useraccount/IEvent";
import { IChainInvite } from "./IChainInvite";

export interface IInteraction {
    matchingAccounts? : IAccount[];
    chainedAccounts? : IAccount[];
    newEvents? : IEvent[];
    chainInvitations? : Array<IChainInvite>;
    brokenChains? : Array<{user : string , chain : string}>;
}