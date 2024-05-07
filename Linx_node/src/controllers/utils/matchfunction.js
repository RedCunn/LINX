const User = require("../../schemas/User");

module.exports = {
    retrieveProfilesBasedOnUserPreferences: async (user, activeAccounts) => {
        try {

            //-----------LOCATION

            let _filteredByLocation = await this.retrieveMatchingProfilesByLocation(user, activeAccounts);
            //--------------GENDER 
            let _filteredByGender = await this.retrieveMatchingProfilesByGender(user, _filteredByLocation);

            console.log(_filteredByGender);

            //----------------AGE 
            // let fromAge = user.ageRange.fromAge
            // let toAge = user.ageRange.toAge

            // let fromDate = new Date();
            // fromDate.setFullYear(fromDate.getFullYear() - fromAge);
            // let fromDateToISO = fromDate.toISOString();
            // let toDate = new Date();
            // toDate.setFullYear(toDate.getFullYear() - toAge);
            // let toDateToISO = toDate.toISOString();

            // let _filteredByAge = await Filtering.find({
            //     '_id': { $in: _filteredByGender.map(doc => doc._id) },
            //     'birthday': { $gte: fromDateToISO, $lte: toDateToISO }
            // });
            // //-----------LANG

            // let _filteredByLang = await Filtering.findOne({
            //     '_id': { $in: _filteredByDiet.map(doc => doc._id) }, 
            //     'language.userLanguages' : { $in: user.language.langPreferences }
            // })
            /*
            const compatibilityPercentage = 0;
            */
            // //--------------BELIEFS (1/8 = 0,125)
            // let _filteredByBeliefs = [];

            // if(user.beliefs.shareBeliefs){

            //     if(user.beliefs.hasReligion){

            //         _filteredByBeliefs = await Filtering.find({
            //             '_id': { $in: _filteredByAge.map(doc => doc._id) }, 
            //             'beliefs.hasReligion': true,
            //             'beliefs.religion' : user.beliefs.religion 
            //         })

            //     }else{
            //         _filteredByBeliefs = await Filtering.find({
            //             '_id': { $in: _filteredByAge.map(doc => doc._id) }, 
            //             'beliefs.hasReligion': false 
            //         })
            //     }
            // }else{
            //     _filteredByBeliefs = _filteredByAge
            // }


            // //-------------POLITICS (4/8 = 0,5)
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

            // //-----------DIET (2/8 = 0,25)

            // let _filteredByDiet = []

            // if(user.diet.shareDiet){
            //     _filteredByDiet = await Filtering.find({
            //         '_id': { $in: _filteredByPolitics.map(doc => doc._id) }, 
            //         'diet.userDiet': user.diet.userDiet
            //     })
            // }else{
            //     _filteredByDiet = _filteredByPolitics
            // }

            // //--------------WORK (1/8 = 0,125)

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
            return _filteredByGender;
        } catch (error) {
            console.log('ERROR SHUFFLING PROFILES : : ', error)
            return [];
        }
    },
    retrieveUsersWithActiveAccounts: () => {
        User
            .find({ accountid: { $ne: null } })
            .populate([
                { path: 'accountid', model: 'Account' }
            ])
            .exec(function (err, users) {
                if (err) {
                    console.log('ERROR RETRIEVING ACTIVE ACCOUNTS ', err)
                    return [];
                } else {
                    const activeUsers = users.filter(user => user.accountid.active);
                    return activeUsers;
                }
            });
    },
    retrieveMatchingProfilesByLocation: async (user, searchgroup) => {

        try {
            let _filteredByUserLocationPref = [];
            const locationkey = user.preferences.proxyRange;

            const query1 = {
                '_id': { $in: searchgroup.map(doc => doc._id) }
            }

            if (locationkey === 'global') {
                _filteredByUserLocationPref = searchgroup
            } else {
                query1[`user.geolocation.${locationkey}_id`] = user.geolocation[`${locationkey}_id`]
                _filteredByUserLocationPref = await User.find(query1);
            }

            let _matchingByUsersLocationPref = []

            const query2 = {
                '_id': { $in: _filteredByUserLocationPref.map(doc => doc._id) },
                'user.preferences.proxyRange': locationkey
            }

            _matchingByUsersLocationPref = await User.find(query2);

            let matchingProfiles = _filteredByUserLocationPref
                .filter(user => _matchingByUsersLocationPref
                    .some(prefUser => prefUser._id.equals(user._id))
                );

            return matchingProfiles;

        } catch (error) {
            console.error('Error al recuperar perfiles coincidentes por ubicación:', error);
            throw error;
        }
    },
    retrieveMatchingProfilesByGender : async (user, searchgroup) => {
        try {
            let _filteredByUserGendersPref = [];
            const query = {
                '_id' : {$in : searchgroup.map(doc => doc._id)},
            }

        } catch (error) {
            
        }
    }
}

