export interface IFiltering{
    birthday: string;
    ageRange : {
        fromAge : number;
        toAge : number;
    };
    myGender : string;
    genders : String [];
    location : {
        country_id : string;
        city_id : string;
        area1_id : string;
        area2_id : string;
        global_code : string;
    };
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
        other?: String;
        shareIndustry : string;
    };
    
}