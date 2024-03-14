export interface IFiltering{
    birthday: Date;
    ageRange : {
        fromAge : number;
        toAge : number;
    };
    myGender : string;
    genders : String [];
    location : string;
    proxyRange : string;
    beliefs : {
        hasReligion : boolean;
        myreligion? : string;
        sharedBeliefs : boolean;
    };
    politics : {
        politicalSpectrum: string;
        sharePolitics: string;
    };
    diet : {
        mydiet : string;
        sharedDiet : boolean;
    };
    language : {
        mylanguages : String [];
        theirlanguages : String [];
    };
    work : {
        myIndustry: string;
        shareIndustry : string;
    };
    
}