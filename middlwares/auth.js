const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  let payload;

  try {
    payload = jwt.verify(token, 'SUPER');
  } catch (err) {
    console.log(err);
  }

  req.user = payload;
  return next();
};

module.exports = { auth };
