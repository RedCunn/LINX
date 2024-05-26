import { IAlbum } from "../media/album";
import { IArticle } from "./IArticle";
import { IArtist } from "../media/artist";
import { IBook } from "../media/book";
import { IExItem } from "./IExitem";
import { IFilm } from "../media/film";
import { IPodcast } from "../media/podcast";
import { ITrack } from "../media/track";
import { IGame } from "../media/game";
import { IEvent } from "./IEvent";

export interface IAccount {
    _id? : string;
    userid : string;
    createdAt : string;
    linxname : string;
    email : string;
    password: string;
    active : boolean;
    articles ?: Array<IArticle>;
    media ?: {
        books : Array<IBook>;
        podcasts : Array<IPodcast>;
        films : Array<IFilm>;
        series : Array<IFilm>;
        music : {
            artists : Array<IArtist>,
            albums : Array<IAlbum>,
            tracks : Array<ITrack>
        }
        games : Array<IGame>;
    },
    myChain ?: Array<{userid : string, roomkey : string, chainedAt : string}>;
    extendedChain? : Array<{mylinxuserid : string , userid : string , roomkey : string}>;
    agenda ? : Array<IEvent>;
    exchanger ?: Array<IExItem>;
}