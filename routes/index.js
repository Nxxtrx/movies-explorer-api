const router = require('express').Router();
const userRoutes = require('./user');
const movieRoutes = require('./movie');
const { createUser, login, signOutUser } = require('../controllers/user');
const { auth } = require('../middlwares/auth');
const celebrate = require('../middlwares/celebrate');
const NotFoundError = require('../errors/NotFoundError');

router.post('/signup', celebrate.validateCreateUser, createUser);
router.post('/signin', celebrate.validateLoginUser, login);

router.use(auth);

router.use('/users', userRoutes);
router.use('/movies', movieRoutes);
router.post('/signout', signOutUser);

router.use('/*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
