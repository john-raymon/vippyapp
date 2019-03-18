var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

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

app.use('/api', require('./routes/beta_api'));

if (isProduction) {
}

module.exports = app;
