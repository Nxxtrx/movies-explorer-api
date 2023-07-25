const mongoose = require('mongoose');
const { regexLink } = require('../utils/constants');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => regexLink.test(v),
      message: 'Неправильный формат ссылки к постеру фильма',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (v) => regexLink.test(v),
      message: 'Неправильный формат ссылки на трейлер фильма',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (v) => regexLink.test(v),
      message: 'Неправильный формат ссылки к миниатюрному изображению постера фильма',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movies', movieSchema);
