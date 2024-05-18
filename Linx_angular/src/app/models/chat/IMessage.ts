import { IAccount } from "../useraccount/IAccount";

export interface IMessage {
    messageid : string;
    text : string;
    timestamp : string;
    sender : {
        accountid : string;
        linxname : string;
    };
}