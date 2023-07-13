const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const router = require('./routes/index');
const errorHandler = require('./middlwares/error');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb', {
  useNewUrlParser: true,
});

app.use(cookieParser());

app.use(bodyParser.json());

app.use(router);

app.use(errorHandler);

app.listen(3000);
