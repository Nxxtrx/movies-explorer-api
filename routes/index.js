const router = require('express').Router();
const userRoutes = require('./user');
const movieRoutes = require('./movie');
const { createUser, login, signOutUser } = require('../controllers/user');
const { auth } = require('../middlwares/auth');
const celebrate = require('../middlwares/celebrate');
const NotFoundError = require('../errors/NotFoundError');

router.post('/api/signup', celebrate.validateCreateUser, createUser);
router.post('/api/signin', celebrate.validateLoginUser, login);

router.use(auth);

router.use('/api/users', userRoutes);
router.use('/api/movies', movieRoutes);
router.post('/api/signout', signOutUser);

router.use('/*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
