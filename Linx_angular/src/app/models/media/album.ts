export interface IAlbum {
    id: string;
    album_type : string;
    total_tracks: number;
    imgurl: string;
    name: string;
    release_date: Date;
    artists : string [];
}