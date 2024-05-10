import { IAccount } from "../useraccount/IAccount";

export interface IMessage {
    text : string;
    timestamp : string;
    sender : {
        accountid : string;
        linxname : string;
    };
}