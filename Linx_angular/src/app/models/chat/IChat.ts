import { IAccount } from "../useraccount/IAccount";
import { IMessage } from "./IMessage";

export interface IChat {
    chatid : string;
    participants : {userid : string; linxaccountid : string;};
    messages : Array<IMessage>;
}