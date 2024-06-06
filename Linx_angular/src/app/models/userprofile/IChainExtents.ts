import { IAccount } from "../useraccount/IAccount";
import { ILinxExtent } from "./ILinxExtent";

export interface IChainExtents {
    linxExtent : ILinxExtent;
    extentAccount : IAccount;
}