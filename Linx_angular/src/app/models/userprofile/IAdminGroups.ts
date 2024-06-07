import { IAccount } from "../useraccount/IAccount";

export interface IAdminGroups {
    chainadminID : string;
    chainName : string;
    accounts : IAccount[];   
}