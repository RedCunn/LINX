import { IAccount } from "../useraccount/account";
import { IFiltering } from "./filteringProfile";

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
        religion? : string;
    };
    politics: string;
    diet : string;
    languages : String [];
    work : {
        industry: string;
        other?: String;
    }
}