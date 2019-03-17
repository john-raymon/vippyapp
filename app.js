var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var isProduction = process.env.NODE_ENV === 'production'
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('./models/User')
require('./models/Host')
require('./models/User')

app.use('/', indexRouter);
app.use('/users', usersRouter);

if (isProduction) {
}

module.exports = app;
