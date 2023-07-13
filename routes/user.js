const router = require('express').Router();
const { getUser, updateUser } = require('../controllers/user');

router.get('/me', getUser);
router.patch('/me', updateUser);

module.exports = router;
