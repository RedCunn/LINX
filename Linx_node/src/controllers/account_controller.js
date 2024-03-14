const bcrypt = require('bcrypt');
const multer = require('multer');
const axios = require('axios');

module.exports = {
    trackLocationGeocode : async (req, res, next) => {
        try {
            
            let {lat, long} = req.query;

            const _res = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${process.env.GOOGLE_MAPS_APIKEY}`)

            console.log("GOOGLE RESPONSE : ", _res.data);

            
            const countryResult = _res.data.results.find(result => result.types.includes('country'));
            console.log("PAIS : ", countryResult)
            
            const cityResult = _res.data.results.find(result => result.types.includes('locality'));
            console.log("CIUDAD : ", cityResult)
            
            const communityResult = _res.data.results.find(result => result.types.includes('administrative_area_level_1'));
            console.log("COMUNIDAD: ", communityResult)
            
            const provinceResult = _res.data.results.find(result => result.types.includes('administrative_area_level_2'));
            console.log('PROVINCIA: ', provinceResult)

            const relevantAddress = cityResult.formatted_address;

            console.log('RELEVANT ADDRESS --------', relevantAddress);

            res.status(200).send({
                code: 0,
                error: null,
                message: 'Trackeada localizacion actual del user por GoogleMaps Geocode',
                token: null,
                userData: null,
                others: relevantAddress
            })

        } catch (error) {
            res.status(400).send({
                code: 1,
                error: error.message,
                message: 'error al trackear localizacion actual por GoogleMaps Geocode',
                token: null,
                userData: null,
                others: null
            })
        }
    },
    signup : async (req, res, next)=>{
        try {
            
        } catch (error) {
            
        }
    },
    signin : async (req, res, next)=>{
        try {

        } catch (error) {
            
        }
    }
}