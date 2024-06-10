import { IAccount } from "../useraccount/IAccount";

export interface IAdminGroups {
    chainadminID : string;
    chainID : string;
    chainName : string;
    accounts : IAccount[];   
}