export interface IFiltering{
    birthday: Date;
    ageRange : {
        fromAge : number;
        toAge : number;
    };
    myGender : string;
    genders : string [];
    location : string;
    proxyRange : string;
    beliefs : {
        religion : boolean;
        spiritual: boolean;
        myreligion? : string;
        sharedBeliefs : boolean;
    };
    politics : {
        politicalSpectrum: string;
        sharedSpectrum ?: boolean;
        excludeRight ?: boolean;
        excludeLeft ? : boolean;
        excludeAuthoritarian ? : boolean;
        excludeLibertarian ?: boolean;
    };
    diet : {
        mydiet : string;
        sharedDiet : boolean;
    };
    language : {
        mylanguages : string [];
        theirlanguages : string [];
    };
    work : {
        myIndustry: string;
        sharedIndustry ?: boolean; 
        avoidMyIndustry?: boolean;
    };
    
}