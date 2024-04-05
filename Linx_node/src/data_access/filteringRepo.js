let Filtering = require('../domain/schemas/Filtering');

class FilteringRepository{

    async createUserFiltering(filtering, session){
        try {
            await Filtering.create([filtering],session);        
            return true;
        } catch (error) {
            console.log('ERROR al crear FILTROS ', error)
            return false;
        }
    }

    async findUserFiltering(userid){
        const userfiltering = await Filtering.findOne({ userid: userid });
        return userfiltering;
    }
}

module.exports = FilteringRepository;