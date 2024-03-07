const axios = require('axios');

module.exports = {
    fetchFilms : async (req, res, next) =>{
        try {
            
        } catch (error) {
            
        }
    },
    fetchPodcasts : async (req, res, next) =>{
        try {
            
        } catch (error) {
            
        }
    },
    fetchTracks : async (req, res, next) =>{
        try {
      
            let _q = req.query.q;

            let _result = await axios.get(`https://https://api.spotify.com/v1/search?q=${_q}&type=track`,
            {
                'Authorization' : `Bearer ${process.env.SPOTIFY_CLIENTID}`
            });

            let foundTracks = [];

            _result.tracks.items.forEach(item => {
                const firstImgurl = item.album.images.find(img => img.url);
                const _artists = [];
                item.artists.forEach(art => _artists.push({id : art.id, name : art.name})); 
                const selectedTrack = {
                    id : item.id,
                    name : item.name,
                    album : {
                        id : item.album.id,
                        total_tracks : item.album.total_tracks,
                        imgurl : firstImgurl,
                        name : item.album.name,
                        release_date : item.album.release_date
                    },
                    artists : _artists
                }
                foundTracks.push(selectedTrack);
            });

            console.log("TRACKS RECUPERADOS : :: : :", foundTracks);

            res.status(200).send({
                code: 0,
                error: null,
                message: 'Tracks recuperados.......',
                token : null,
                userData : null,
                others : foundTracks
            })
            
        } catch (error) {
            
            
            res.status(400).send({
                code: 1,
                error: error.message,
                message: 'ERROR AL RECUPERAR TRACKS',
                token : null,
                userData : null,
                others : null
            })
        }
    },
    fetchAlbums: async (req, res, next) =>{
        try {
            
        } catch (error) {
            
        }
    },
    fetchArtists: async (req, res, next) =>{
        try {
            
        } catch (error) {
            
        }
    },
    fetchBooks: async (req, res, next) =>{
        try {
            
        } catch (error) {
            
        }
    },
    fetchGames: async (req, res, next) =>{
        try {
            
        } catch (error) {
            
        }
    }

}