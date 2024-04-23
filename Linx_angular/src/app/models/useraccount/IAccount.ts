import { IAlbum } from "../media/album";
import { IArticle } from "./IArticle";
import { IArtist } from "../media/artist";
import { IBook } from "../media/book";
import { IExItem } from "./IExitem";
import { IFilm } from "../media/film";
import { IPodcast } from "../media/podcast";
import { ITrack } from "../media/track";
import { IGame } from "../media/game";

export interface IAccount {
    accountid : string;
    userid : string;
    createdAt : string;
    linxname : string;
    email : string;
    password: string;
    active : boolean;
    articles ?: Array<IArticle>;
    exchanger ?: Array<IExItem>;
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
    myCircle ?: Array<string>;
}