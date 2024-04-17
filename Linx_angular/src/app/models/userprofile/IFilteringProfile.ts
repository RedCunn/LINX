export interface IFiltering{
    ageRange : {
        fromAge : number;
        toAge : number;
    };
    genders : String [];
    proxyRange : string;
    shareBeliefs : boolean;
    sharePolitics: string;
    shareDiet : boolean;
    languages : String [];
    shareIndustry : string;
}