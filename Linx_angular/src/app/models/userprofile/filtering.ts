export interface IFiltering{
    ageRange : {
        fromAge : number;
        toAge : number;
    },
    gender : {
        genders : string []
    },
    proximity : {
        proxyRange : string;
    },
    beliefs : {
        religion : boolean;
        spiritual: boolean;
        myreligion? : string;
        sharedBeliefs : boolean;
    },
    politics : {
        politicalSpectrum: string;
        sharedSpectrum ?: boolean;
        excludeRight ?: boolean;
        excludeLeft ? : boolean;
        excludeAuthoritarian ? : boolean;
        excludeLibertarian ?: boolean;
    },
    diet : {
        mydiet : string;
        donteat : string [];
        sharedDiet : boolean;
    },
    languages : {
        mylanguages : string [];
        theirlanguages : string [];
    },
    work : {
        myIndustry: string;
        sharedIndustry ?: boolean; 
        avoidMyIndustry?: boolean;
    }
    
}