import { IAccount } from "../useraccount/IAccount";
import { IFiltering } from "./IFilteringProfile";

export interface IUser {
    userid : string;
    accountid : string;
    name : string;
    lastname : string;
    preferences : IFiltering;
    account : IAccount;
    birthday: string;
    gender : string;
    location : {
        country_id : string;
        city_id : string;
        area1_id : string;
        area2_id : string;
        global_code : string;
    };
    beliefs : {
        hasReligion : boolean;
    };
    politics: string;
    diet : string;
    languages : String [];
    work : {
        industry: string;
        other?: String;
    }
}