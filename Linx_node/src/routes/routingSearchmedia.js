const express = require('express');
const router = express.Router();
const SearchmediaController = require('../controllers/searchmedia_controller');

router.get('/films', SearchmediaController.fetchFilms);
router.get('/books', SearchmediaController.fetchBooks);
router.get('/podcasts', SearchmediaController.fetchPodcasts);
router.get('/albums', SearchmediaController.fetchAlbums);
router.get('/items', SearchmediaController.fetchSpotifyItems);
router.get('/artists', SearchmediaController.fetchArtists);
router.get('/games', SearchmediaController.fetchGames);

module.exports = router;