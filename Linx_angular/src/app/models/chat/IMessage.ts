import { IAccount } from "../useraccount/IAccount";

export interface IMessage {
    sender : {
        accountid : string;
        linxname : string;
    };
    text : string;
    timestamp : string;
    _id? : string;
}