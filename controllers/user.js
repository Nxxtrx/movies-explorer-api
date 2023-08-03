const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/user');

const BadRequestError = require('../errors/BadRequestError');
const ConflictingRequestError = require('../errors/ConflictingRequestError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { DEV_JWT_SECRET } = require('../utils/config');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Пользователь с данным id не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при поиске _id'));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    { new: true, runValidators: true },
  ).orFail(new NotFoundError('Пользователь с указанным id не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении данных профиля'));
      } else if (err.code === 11000) {
        next(new ConflictingRequestError('Пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const { password } = req.body;
  bcrypt.hash(String(password), 10)
    .then((hashedPassword) => User.create({ ...req.body, password: hashedPassword }))
    .then((user) => {
      const { email, name } = user;
      res.status(201).send({ email, name });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      } else if (err.code === 11000) {
        next(new ConflictingRequestError('Пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .orFail(new UnauthorizedError('Неправильный логин или пароль'))
    .then((user) => {
      bcrypt.compare(String(password), user.password)
        .then((isValidUser) => {
          if (isValidUser) {
            const jwt = jsonWebToken.sign({
              _id: user._id,
            }, NODE_ENV === 'production' ? JWT_SECRET : DEV_JWT_SECRET);

            res.cookie('jwt', jwt, {
              maxAge: 3600 * 24 * 7,
              httpOnly: true,
              sameSite: 'none',
              security: true,
            });

            const { _id, name } = user;
            res.send({ _id, email, name });
          } else {
            throw new UnauthorizedError('Неправльный логин или пароль');
          }
        })
        .catch(next);
    })
    .catch(next);
};

const signOutUser = (req, res) => {
  if (req.cookies.jwt) {
    res.clearCookie('jwt');
    res.status(200).send({ message: 'Куки удалены' });
  } else {
    throw new UnauthorizedError('Пользователь не авторизован');
  }
};

module.exports = {
  getUser,
  createUser,
  login,
  updateUser,
  signOutUser,
};
