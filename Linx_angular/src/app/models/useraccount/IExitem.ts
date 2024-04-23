export interface IExItem{
    iditem : string;
    postedOn : Date;
    name : string;
    tags : string[];
    description?: string;
    picture : string;
    onExchange?: string[];
}