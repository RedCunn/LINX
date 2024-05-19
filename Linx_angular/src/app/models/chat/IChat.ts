import { IAccount } from "../useraccount/IAccount";
import { IMessage } from "./IMessage";

export interface IChat {
    participants : {userid_a: string; userid_b : string;};
    messages : Array<IMessage>;
    roomkey : string;
}