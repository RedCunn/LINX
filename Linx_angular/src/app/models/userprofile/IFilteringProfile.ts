export interface IFiltering{
    ageRange : {
        fromAge : number;
        toAge : number;
    };
    genders : String [];
    proxyRange : string;
    sharePolitics: string;
    shareDiet : boolean;
    languages : String [];
    shareIndustry : string;
}