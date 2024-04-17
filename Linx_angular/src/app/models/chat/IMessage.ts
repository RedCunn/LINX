import { IUser } from "../userprofile/IUser";

export interface IMessage {
    text : String;
    timestamp : String;
    sender : IUser;
}