import { IAccount } from "../useraccount/IAccount";
import { IMessage } from "./IMessage";

export interface IChat {
    chatid : string;
    participants : {userid_a: string; userid_b : string;};
    messages : Array<IMessage>;
    roomkey : string;
}