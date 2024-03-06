import { IAccount } from "../useraccount/account";
import { IFiltering } from "./filtering";

export interface IUser {
    iduser : string;
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