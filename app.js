var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config(); 
var mongoose = require('mongoose');

const seedDB = require('./scripts/seed/seedDB');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/myDatabase';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Successfully connected to MongoDB');

    if (process.env.NODE_ENV !== 'production') {
      console.log('Seeding database...');
      await seedDB();
      console.log('Database seeded successfully.');
    }
  })
  .catch(err => console.error('Connection error', err));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
