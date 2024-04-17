import { IUser } from "../userprofile/IUser";
import { IMessage } from "./IMessage";

export interface IChat {
    participants : Array<IUser>;
    messages : Array<IMessage>;
}