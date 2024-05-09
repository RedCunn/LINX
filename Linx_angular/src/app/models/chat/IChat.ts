import { IAccount } from "../useraccount/IAccount";
import { IMessage } from "./IMessage";

export interface IChat {
    participants : Array<IAccount>;
    messages : Array<IMessage>;
}