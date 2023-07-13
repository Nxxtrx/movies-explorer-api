const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/user');

const getUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch((err) => console.log(err));
};

const updateUser = (req, res) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    { new: true, runValidators: true },
  ).then((user) => res.send(user))
    .catch((err) => console.log(err));
};

const createUser = (req, res) => {
  const { password } = req.body;
  bcrypt.hash(String(password), 10)
    .then((hashedPassword) => User.create({ ...req.body, password: hashedPassword }))
    .then((user) => {
      const { email, name } = user;
      res.status(201).send({ email, name });
    })
    .catch((err) => console.log(err));
};

const login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      bcrypt.compare(String(password), user.password)
        .then((isValidUser) => {
          if (isValidUser) {
            const jwt = jsonWebToken.sign({
              _id: user._id,
            }, 'SUPER');

            res.cookie('jwt', jwt, {
              maxAge: 3600 * 24 * 7,
              httpOnly: true,
              sameSite: true,
            });

            const { _id, name } = user;
            res.send({ _id, email, name });
          } else {
            console.log('неправильный пароль');
          }
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

module.exports = {
  getUser,
  createUser,
  login,
  updateUser,
};
