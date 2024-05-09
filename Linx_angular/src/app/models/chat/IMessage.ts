import { IAccount } from "../useraccount/IAccount";

export interface IMessage {
    text : String;
    timestamp : String;
    sender : IAccount;
}