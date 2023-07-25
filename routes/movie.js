const router = require('express').Router();
const { createMovie, getMovies, deleteMovie } = require('../controllers/movie');
const celebrate = require('../middlwares/celebrate');

router.post('/', celebrate.validateCreateMovie, createMovie);
router.get('/', getMovies);
router.delete('/:movieId', celebrate.validateMovieId, deleteMovie);

module.exports = router;
