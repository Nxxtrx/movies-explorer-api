const router = require('express').Router();
const userRoutes = require('./user');
const { createUser, login } = require('../controllers/user');
const { auth } = require('../middlwares/auth');

router.post('/signup', createUser);
router.post('/signin', login);
router.use(auth);
router.use('/users', userRoutes);

module.exports = router;
