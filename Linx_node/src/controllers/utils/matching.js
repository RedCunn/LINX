const User = require("../../schemas/User");

const retrieveUsersWithActiveAccounts = async () => {
    return User
            .find({})
            .populate({
                path: 'accountid',
                match: { active: true }
            })
            .then(users => {
                return users;
            })
            .catch(err => {
                console.log('ERROR RETRIEVING ACTIVE ACCOUNTS ', err)
                return [];
            });
}

const retrieveMatchingProfilesByLocation = async (user, searchgroup) => {

    try {
        let _filteredByUserLocationPref = [];
        const locationkey = user.preferences.proxyRange;

        const userPrefQuery = {
            '_id': { $in: searchgroup.map(doc => doc._id) }
        }

        if (locationkey === 'global') {
            _filteredByUserLocationPref = searchgroup
        } else {
            userPrefQuery[`geolocation.${locationkey}_id`] = user.geolocation[`${locationkey}_id`]
            _filteredByUserLocationPref = await User.find(userPrefQuery);
        }

        const userMatchQuery = {
            '_id': { $in: _filteredByUserLocationPref.map(doc => doc._id) },
            'preferences.proxyRange': locationkey
        }

        let matchingByUsersLocationPref = await User.find(userMatchQuery);
        return matchingByUsersLocationPref;

    } catch (error) {
        console.error('Error al recuperar perfiles coincidentes por ubicación:', error);
        throw error;
    }
}

const retrieveMatchingProfilesByGender = async (user, searchgroup) => {
    try {
        const userPrefQuery = {
            '_id': { $in: searchgroup.map(doc => doc._id) },
            'gender': { $in: user.preferences.genders }
        }
        let _filteredByUserGendersPref = await User.find(userPrefQuery)

        const userMatchQuery = {
            '_id': { $in: _filteredByUserGendersPref.map(doc => doc._id) },
            'preferences.genders': { $in: [user.gender] }
        }
        let matchingByUsersGendersPref = await User.find(userMatchQuery);
        console.log('FILTERED BY gen __________________________________________',matchingByUsersGendersPref);
        return matchingByUsersGendersPref;

    } catch (error) {
        console.error('Error al recuperar perfiles coincidentes por género:', error);
        throw error;
    }
}

const retrieveMatchingProfilesByAge = async (user, searchgroup) => {
    try {
        const userPrefQuery = {
            '_id': { $in: searchgroup.map(doc => doc._id) },
            'birthday': {
                $gte: new Date(user.preferences.ageRange.fromAge),
                $lte: new Date(user.preferences.ageRange.toAge)
            }
        }
        let _filteredByUserAgePref = await User.find(userPrefQuery);

        const userMatchQuery = {
            '_id': { $in: _filteredByUserAgePref.map(doc => doc._id) },
            $and: [
                { 'preferences.ageRange.fromAge': { $lte: user.birthday } },
                { 'preferences.ageRange.toAge': { $gte: user.birthday } }
            ]
        }
        
        let matchingByUsersAgePref = await User.find(userMatchQuery);
        console.log('FILTERED BY age __________________________________________',matchingByUsersAgePref);
        return matchingByUsersAgePref;
    } catch (error) {
        console.error('Error al recuperar perfiles coincidentes por edad:', error);
        throw error;
    }
}

const retrieveMatchingProfilesByLanguage = async (user, searchgroup) => {
    try {
        const userPrefQuery = {
            '_id': { $in: searchgroup.map(doc => doc._id) },
            'languages': { $in: [user.preferences.languages] }
        }
        let _filteredByUserLangsPref = await User.find(userPrefQuery)

        const userMatchQuery = {
            '_id': { $in: _filteredByUserLangsPref.map(doc => doc._id) },
            'preferences.languages': { $in: [user.languages] }
        }
        let matchingByUsersLangsPref = await User.find(userMatchQuery);

        return matchingByUsersLangsPref;
    } catch (error) {
        console.error('Error al recuperar perfiles coincidentes por lengua:', error);
        throw error;
    }
}

const getPoliticsCompatibility = (user, linx) => {
    try {
        
    } catch (error) {
        
    }
}
const getDietCompatibility = (user, linx) => {
    try {
        
    } catch (error) {
        
    }
}
const getWorkCompatibility = (user, linx) => {
    try {
        
    } catch (error) {
        
    }
}

const getCompatibilityPercentage = async (user, searchgroup) => {
    try {
        searchgroup.map((linx , i) => {
            console.log(linx);
        })
    } catch (error) {
        
    }
}

module.exports = {
    retrieveProfilesBasedOnCompatibility: async (user) => {
        try {

            //----------- active accounts 
            let _activeAccounts = await retrieveUsersWithActiveAccounts();
            //-----------LOCATION
            let _filteredByLocation = await retrieveMatchingProfilesByLocation(user, _activeAccounts);
            //--------------GENDER 
            let _filteredByGender = await retrieveMatchingProfilesByGender(user, _filteredByLocation);
            //----------------AGE 
            let _filteredByAge = await retrieveMatchingProfilesByAge(user, _filteredByGender);
            //-----------LANG
            let _filteredByLang = await retrieveMatchingProfilesByLanguage(user, _filteredByAge);

            let compatibilityPercentage = 0;
        
            this.getCompatibilityPercentage(user, _filteredByLang);
            //-------------POLITICS (2/4 = 0,5)
            // // autho-left || libe-left || autho-right || libe-right || some-left || some-right || center || none
            // let _filteredByPolitics = [];

            // if(user.politics.sharePolitcs !== 'false'){
            //     // true || false || lessright || lessleft || lessautho || lesslibe || lessnone || lesscenter
            //     switch(user.politics.sharePolitcs){
            //         case 'true':
            //             _filteredByPolitics = await Filtering.find({
            //                 '_id': { $in: _filteredByBeliefs.map(doc => doc._id) }, 
            //                 'politics.userPoliticalSpec': user.politics.userPoliticalSpec 
            //             })
            //             break;
            //         case 'lessright':
            //             _filteredByPolitics = await Filtering.find({
            //                 '_id': { $in: _filteredByBeliefs.map(doc => doc._id) }, 
            //                 'politics.userPoliticalSpec': { $not: /.*right.*/ }
            //             })
            //             break;
            //         case 'lessleft':
            //             _filteredByPolitics = await Filtering.find({
            //                 '_id': { $in: _filteredByBeliefs.map(doc => doc._id) }, 
            //                 'politics.userPoliticalSpec': { $not: /.*left.*/ }
            //             })
            //             break;
            //         case 'lessautho':
            //             _filteredByPolitics = await Filtering.find({
            //                 '_id': { $in: _filteredByBeliefs.map(doc => doc._id) }, 
            //                 'politics.userPoliticalSpec': { $not: /.*autho.*/ }
            //             })
            //             break;
            //         case 'lesslibe':
            //             _filteredByPolitics = await Filtering.find({
            //                 '_id': { $in: _filteredByBeliefs.map(doc => doc._id) }, 
            //                 'politics.userPoliticalSpec': { $not: /.*libe.*/ }
            //             })
            //             break;
            //         case 'lessnone':
            //             _filteredByPolitics = await Filtering.find({
            //                 '_id': { $in: _filteredByBeliefs.map(doc => doc._id) }, 
            //                 'politics.userPoliticalSpec': { $ne: 'none' }
            //             })
            //             break;
            //         case 'lesscenter':
            //             _filteredByPolitics = await Filtering.find({
            //                 '_id': { $in: _filteredByBeliefs.map(doc => doc._id) }, 
            //                 'politics.userPoliticalSpec': { $ne: 'center' }
            //             })
            //             break;

            //     }

            // }else{
            //     _filteredByPolitics = _filteredByBeliefs
            // }

            //-----------DIET (1/4 = 0,25)

            // let _filteredByDiet = []

            // if(user.diet.shareDiet){
            //     _filteredByDiet = await Filtering.find({
            //         '_id': { $in: _filteredByPolitics.map(doc => doc._id) }, 
            //         'diet.userDiet': user.diet.userDiet
            //     })
            // }else{
            //     _filteredByDiet = _filteredByPolitics
            // }

            //--------------WORK (1/4 = 0,25)

            // let _filteredByWork = [];

            // if(user.work.shareIndustry !== 'false'){

            //     if(user.work.shareIndustry !== 'true'){

            //         if(user.work.userIndustry !== 'other'){
            //             _filteredByWork = await Filtering.findOne({
            //                 '_id': { $in: _filteredByLang.map(doc => doc._id) }, 
            //                 'work.userIndustry' : user.work.userIndustry
            //             })
            //         }else{
            //             _filteredByWork = await Filtering.findOne({
            //                 '_id': { $in: _filteredByLang.map(doc => doc._id) }, 
            //                 'work.other' : user.work.other
            //             })
            //         }

            //     }else{

            //         if(user.work.userIndustry !== 'other'){
            //             _filteredByWork = await Filtering.findOne({
            //                 '_id': { $in: _filteredByLang.map(doc => doc._id) }, 
            //                 'work.userIndustry' : {$ne : user.work.userIndustry}
            //             })
            //         }else{
            //             _filteredByWork = await Filtering.findOne({
            //                 '_id': { $in: _filteredByLang.map(doc => doc._id) }, 
            //                 'work.other' : {$ne : user.work.other}
            //             })
            //         }   
            //     }

            // }else{
            //     _filteredByWork = _filteredByLang
            // }

            /*
            if(compatibilityPercentage < 0,5){
                //no pasan el filtro
            }
            */
            return _filteredByLang;
        } catch (error) {
            console.error('ERROR AL RECUPERAR PERFILES COMPATIBLES', error);
            throw error;
        }
    }
}

