export interface ISong{
id: string;
name: string; 
album : {
    total_tracks : number;
    imgurl : string;
    name: string;
    release_date : number;
 }   
artists : string[];
}