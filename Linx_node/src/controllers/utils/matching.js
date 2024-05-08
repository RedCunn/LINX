const usersFilterRepo = require('./usersFilterRepository');

const getMatchingLocation = async (user, searchgroup) => {

    try {
        let _filteredByUserPreferences = [];
        const locationkey = user.preferences.proxyRange;

        if (locationkey === 'global') {
            _filteredByUserPreferences = searchgroup;
        } else {
            _filteredByUserPreferences = searchgroup.filter(doc =>
                doc.geolocation[`${locationkey}_id`] === user.geolocation[`${locationkey}_id`]
            );
        }

        const filteredByOthersPreferences = _filteredByUserPreferences.filter(doc =>
            doc.preferences.proxyRange === locationkey
        );

        return filteredByOthersPreferences;
    } catch (error) {
        console.error('Error al recuperar perfiles coincidentes por ubicación:', error);
        throw error;
    }
}

const getMatchingGenders = async (user, searchgroup) => {
    try {
        const _filteredByUserPreferences = searchgroup.filter(doc =>
            user.preferences.genders.includes(doc.gender)
        );

        const filteredByOthersPreferences = _filteredByUserPreferences.filter(doc =>
            doc.preferences.genders.includes(user.gender)
        );

        return filteredByOthersPreferences;
    } catch (error) {
        console.error('Error al recuperar perfiles coincidentes por género:', error);
        throw error;
    }
}

const getMatchingAge = async (user, searchgroup) => {
    try {
        const currentYear = new Date().getFullYear();
        const userAge = currentYear - new Date(user.birthday).getFullYear();

        const _filteredByUserPreferences = searchgroup.filter(doc => {
            return userAge >= user.preferences.ageRange.fromAge && userAge <= user.preferences.ageRange.toAge;
        });

        const filteredByOthersPreferences = _filteredByUserPreferences.filter(doc =>
            doc.preferences.ageRange.fromAge <= userAge && doc.preferences.ageRange.toAge >= userAge
        );

        return filteredByOthersPreferences;
    } catch (error) {
        console.error('Error al recuperar perfiles coincidentes por edad:', error);
        throw error;
    }
}

const getMatchingLanguages = async (user, searchgroup) => {
    try {
        const _filteredByUserPreferences = searchgroup.filter(doc =>
            doc.languages.some(lang => user.preferences.languages.includes(lang))
        );

        const filteredByOthersPreferences = _filteredByUserPreferences.filter(doc =>
            doc.preferences.languages.some(lang => user.languages.includes(lang))
        );

        return filteredByOthersPreferences;
    } catch (error) {
        console.error('Error al recuperar perfiles coincidentes por lengua:', error);
        throw error;
    }
}
const getAxisFromPolitics = (politics) => {
    if (politics === 'center' || politics === 'none') {
        return politics;
    } else {
        const [abs, ord] = politics.split('-');
        return { abs, ord };
    }
};
const compareAxis = (axisA, axisB) => {

    if (typeof axisA === 'string' && typeof axisB === 'string') {
        return axisA === axisB;
    }
    if (typeof axisA === 'object' && typeof axisB === 'object') {

        return axisA.abs === axisB.abs && axisA.ord === axisB.ord;
    }

    return false;
}

const comparePolitics = (userAxis, axisToCompare, preference) => {
    if (preference === 'true') {
        return compareAxis(userAxis, axisToCompare);
    } else if (preference === 'false') {
        return true;
    } else {
        const prefValue = preference.split('-')[1];
        switch (prefValue) {
            case 'center':
                return axisToCompare !== 'center';
            case 'autho':
                return axisToCompare.abs !== 'autho';
            case 'right':
                return axisToCompare.ord !== 'right';
            case 'left':
                return axisToCompare.ord !== 'left';
            case 'none':
                return axisToCompare !== 'none';
            default:
                return false;
        }
    }
};

const getPoliticsCompatibility = (user, linx) => {
    try {
        let percentage = 0;
        const userAxis = getAxisFromPolitics(user.politics);
        const linxAxis = getAxisFromPolitics(linx.politics);
        const userPref = user.preferences.sharePolitics;
        const linxPref = linx.preferences.sharePolitics;
        const userMatch = comparePolitics(userAxis, linxAxis, userPref);
        const linxMatch = comparePolitics(linxAxis, userAxis, linxPref);

        if (userMatch && linxMatch) {
            percentage += 0.5;
        }

        return percentage;
    } catch (error) {
        console.error('Error al recuperar porcentaje de compatibilidad por política:', error);
        throw error;
    }
};

const compareDietPreferences = (share, dietA, dietB) => {

    if (share) {
        if (dietA === dietB) {
            return true;
        } else {
            return false;
        }
    } else {
        return true;
    }
}

const getDietCompatibility = (user, linx) => {
    //-----------DIET (1/4 = 0,25)
    try {
        let percentage = 0;

        const userPref = user.preferences.shareDiet;
        const linxPref = linx.preferences.shareDiet;
        const userMatch = compareDietPreferences(userPref, user.diet, linx.diet);
        const linxMatch = compareDietPreferences(linxPref, linx.diet, user.diet);

        if (userMatch && linxMatch) {
            percentage += 0.25;
        }

        return percentage;
    } catch (error) {
        console.error('Error al recuperar porcentaja de compatibilidad por dieta:', error);
        throw error;
    }
}

const compareWorkPreferences = (preference, workA, workB) => {
    switch (preference) {
        case 'true':
            return workA === workB;
        case 'false':
            return true;
        case 'avoid':
            return workA !== workB;
        default:
            return false; 
    }
}


const getWorkCompatibility = (user, linx) => {
    //--------------WORK (1/4 = 0,25)
    try {
        // true || false || avoid
        let percentage = 0;
        const userWork = user.work.industry ? user.work.industry : user.work.other;
        const linxWork = linx.work.industry ? linx.work.industry : linx.work.other;

        if(userWork === '' && linxWork === ''){
            return 0.25;
        }

        const userPref = user.preferences.shareIndustry;
        const linxPref = linx.preferences.shareIndustry;
        const userMatch = compareWorkPreferences(userPref, userWork, linxWork);
        const linxMatch = compareWorkPreferences(linxPref, linxWork, userWork);

        if (userMatch && linxMatch) {
            percentage += 0.25;
        }

        return percentage;
    } catch (error) {
        console.error('Error al recuperar porcentaja de compatibilidad por trabajo:', error);
        throw error;
    }
}

const getCompatibilityPercentage = async (user, searchgroup) => {
    try {
        let candidateGroup = [];
        let rate = 0;
        searchgroup.map((linx) => {
            const politicsRate = getPoliticsCompatibility(user, linx);
            const dietRate = getDietCompatibility(user, linx);
            const workRate = getWorkCompatibility(user, linx);

            rate = politicsRate + dietRate + workRate;

            if (rate >= 0.5) {
                candidateGroup.push(linx)
            }
        })
        return candidateGroup;
    } catch (error) {
        console.error('Error al recuperar porcentaje de compatibilidad............:', error);
        throw error;
    }
}

module.exports = {
    retrieveProfilesBasedOnCompatibility: async (user) => {
        try {

            //----------- active accounts 
            let _activeAccounts = await usersFilterRepo.retrieveUsersWithActiveAccounts(user);
            //-----------LOCATION
            let _filteredByLocation = await getMatchingLocation(user, _activeAccounts);
            //--------------GENDER 
            let _filteredByGender = await getMatchingGenders(user, _filteredByLocation);
            //----------------AGE 
            let _filteredByAge = await getMatchingAge(user, _filteredByGender);
            //-----------LANG
            let _filteredByLang = await getMatchingLanguages(user, _filteredByAge);

            const finalGroup = await getCompatibilityPercentage(user, _filteredByLang);

            const accounts = await usersFilterRepo.retrieveAccountsFromUsers(finalGroup);

            return accounts;
        } catch (error) {
            console.error('ERROR AL RECUPERAR PERFILES COMPATIBLES', error);
            throw error;
        }
    }
}

