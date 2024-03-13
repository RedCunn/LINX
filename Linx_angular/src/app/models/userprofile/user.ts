import { IAccount } from "../useraccount/account";
import { IFiltering } from "./filteringProfile";

export interface IUser {
    userid : string;
    accountid : string;
    username : string;
    name : string;
    lastname : string;
    filters : IFiltering;
    account : IAccount;
}