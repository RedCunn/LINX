import { IAccount } from "../useraccount/account";
import { IFiltering } from "./filtering";

export interface IUser {
    userid : string;
    accountid : string;
    username : string;
    name : string;
    lastname : string;
    phone : string;
    gender : string;
    birthday: Date;
    location : string;
    filters : IFiltering;
    account : IAccount;
}