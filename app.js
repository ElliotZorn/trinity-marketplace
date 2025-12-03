var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config(); 
var mongoose = require('mongoose');
const seedDb = require('./scripts/seed/seedDB');


var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
// var interestsRouter = require('./routes/interests');
// var purchasesRouter = require('./routes/purchases');
var productsRouter = require('./routes/products');
var authRouter = require('./routes/auth');


var app = express();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/myDatabase';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Successfully connected to MongoDB');
    // Optionally seed the database
    // uncomment the line below to seed the database, didnt bother with docker commands lol.
    // await seedDb(); 
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
// app.use('/users', usersRouter);
// app.use('/interests', interestsRouter);
// app.use('/purchases', purchasesRouter);
app.use('/products', productsRouter);
app.use('/auth', authRouter); 

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
