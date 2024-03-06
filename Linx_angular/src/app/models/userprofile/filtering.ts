export interface IFiltering{
    ageRange : {
        idc: boolean;
        fromAge? : number;
        toAge? : number;
    },
    gender : {
        idc : boolean;
        genders ? : string []
    },
    proximity : {
        idc : boolean;
        proxyRangeKm : number;
    },
    consumption : {
        idc : boolean;
        consumes : {
            idcTobacco : boolean;
            tobacco : boolean;
            idcAlcohol : boolean;
            alcohol : boolean;
            idcOthers : boolean;
            others : boolean;
        };
    },
    beliefs : {
        idc : boolean;
        beliefs : string [];
        sharedBeliefs : boolean;
    },
    diet : {
        idc : boolean;
        diet : string [];
        sharedDiet : boolean;
    },
    languages : {
        idc : boolean;
        languages : string [];
        sharedLanguages : boolean;
    },
    politicalTendencies : {
        idc : boolean;
        politicalSpectrum ?: string;
        sharedSpectrums? : string [];
    }
    work : {
        idc : boolean;
        profession ? : string;
        projects ? : string [];
        sharedProfession : boolean; 
    }
    
}