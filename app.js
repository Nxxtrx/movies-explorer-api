const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
const router = require('./routes/index');
const errorHandler = require('./middlwares/error');
const { requestLogger, errorLogger } = require('./middlwares/logger');
const { DEV_MONGODB_URI } = require('./utils/config');
const { limiter } = require('./middlwares/rateLimiter');

const app = express();

app.use(cors({ origin: ['http://localhost:3000'], credentials: true, maxAge: 360000 }));

mongoose.connect(process.env.NODE_ENV === 'production' ? process.env.MONGODB_URI : DEV_MONGODB_URI, {
  useNewUrlParser: true,
});

app.use(cookieParser());
app.use(express.json());

app.use(helmet());

app.use(requestLogger);

app.use(limiter);

app.use(router);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(3000);
