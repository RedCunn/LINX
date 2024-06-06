import { IAccount } from "../useraccount/IAccount";

export interface IChainExtents {
    chainid : string;
    linxExtent : { myLinxUserid : string , account : IAccount};
}