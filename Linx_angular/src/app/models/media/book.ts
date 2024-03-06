export interface IBook{
    idbook : string;
    volumeInfo : {
        title : string;
        isbn : string [];
        first_publish_year: number;
        publish_year: number[];
        publish_place: string[];
        cover_i: string;
        author_name : string[];
        author_key : string [];
        subject: string[];
        publisher: string [];
        language: string [];
    }
}