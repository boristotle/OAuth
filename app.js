    require('dotenv').load();
    var FacebookStrategy = require('passport-facebook').Strategy;
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');  
    var passport = require('passport');
       var session = require('sessions')
    var expressSession = require('express-session');




var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({
    secret: '1234569',
    name: 'hello',
    proxy: true,
    resave: true,
    saveUninitialized: true
}));
  app.use(passport.initialize())
        app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

  app.use(function (req, res, next) {
      res.locals.user = req.user;
      next();
    })


app.use('/', routes);
app.use('/users', users);






    passport.use(new FacebookStrategy({
     clientID: process.env.FB_ID,
     clientSecret: process.env.FB_SECRET,
     callbackURL: 'http://localhost:3000/auth/facebook/callback'
    },
    function(accessToken, refreshToken, profile, done) {
       // console.log(profile);
     process.nextTick(function () {
       return done(null, {name: profile.displayName});
     });
     }
    )); 


    passport.serializeUser(function(user, done) {
            done(null, user);
        });

        // used to deserialize the user
    passport.deserializeUser(function(user, done) {
                done(null, user);
          });


    app.get('/auth/facebook',
      // passport.authenticate('facebook'));
    passport.authenticate('facebook', {authType: 'reauthenticate', callbackURL:'http://localhost:3000/auth/facebook/callback'}))

    app.get('/auth/facebook/callback',
      passport.authenticate('facebook', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/home');
      });




    app.get('/logout', function(req, res, next) {
      req.session = null;
        res.redirect('/');
      });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers



// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
