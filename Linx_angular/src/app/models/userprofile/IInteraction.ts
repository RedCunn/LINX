import { IAccount } from "../useraccount/IAccount";
import { IEvent } from "../useraccount/IEvent";
import { IChainInvite } from "./IChainInvite";

export interface IInteraction {
    matchingAccounts? : Array<IAccount>;
    chainedAccounts? : Array<{account : IAccount , chain : {chainid : string , chainname : string}}>;
    refusedInvitations? : Array<{account : IAccount , chain : {chainid : string , chainname : string}}>;
    chainInvitations? : Array<IChainInvite>;
    brokenChains? : Array<{user : string , chain : string}>;
    newEvents? : IEvent[];
}