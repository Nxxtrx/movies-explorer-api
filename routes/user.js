const router = require('express').Router();
const { getUser, updateUser } = require('../controllers/user');
const celebrate = require('../middlwares/celebrate');

router.get('/me', getUser);
router.patch('/me', celebrate.validateUpdateUser, updateUser);

module.exports = router;
