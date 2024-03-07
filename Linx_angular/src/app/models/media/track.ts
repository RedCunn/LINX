export interface ITrack{
id: string;
name: string; 
album : {
    id : string;
    total_tracks : number;
    imgurl : string;
    name: string;
    release_date : number;
 }   
artists :  Array<{id : string,name : string}>
}