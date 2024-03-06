export interface IFilm {
 idfilm: string;
 original_lang: string;
 original_title: string;
 overview: string;
 release_date: Date;
 poster_path: string;   
 genres : string [];
 budget: number;
 production_countries : string [];
 spoken_languages: string [];
 credits : {
    direction : string [];
    cast : string [];
 }
}