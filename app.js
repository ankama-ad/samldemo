const dotenv = require('dotenv')
const result = dotenv.config()
const passport = require('./config');

if (result.error) {
  throw result.error
}

console.log(result.parsed)

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const helmet = require('helmet');

const userV1Router = require('./server/v1/routes');

// const { errorHandler } = require('./server/v1/middlewares');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();


app.use(express.urlencoded({
  extended: true,
}));

app.use(express.json({ limit: '15mb' }));
app.use(helmet());

app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/home', usersRouter);


//= ==========Registering Router==========
app.use('/user/v1/', userV1Router);
// http://localhost:5300/user/v1/login/sso

//= ======ERROR Handler
// app.use(errorHandler);

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





