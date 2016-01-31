var http = require('http');
var express = require('express');

var users = require('./routes/users');
var path = require('path');
var route = require('./routes/index');
var u = require('./routes/u')
var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');

//新插件
var partials = require('express-partials');
var flash = require('connect-flash');

//自己的插件
var mycommon = require('mycommon');

//mongodb支持的会话
var MongoStore = require('connect-mongo/es5')(session);
var settings = require('./settings');


var app = express();





// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
app.use(partials());
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());




//注册session
app.use(session({ resave: true,
  saveUninitialized: true,
  secret: settings.cookieSecret,
  store: new MongoStore({
    //db: settings.db,
    url: 'mongodb://localhost/microblog'
  })
}));




app.use(express.static(path.join(__dirname, 'public')));

app.use(flash())
//注册视图交互
app.use(function(req, res, next){
  res.locals.user = req.session.user;
  //res.locals.post = req.session.post;
  var error = req.flash('error');
  res.locals.error = error.length ? error : null;

  var success = req.flash('success');
  res.locals.success = success.length ? success : null;
  next();
});


//路由
app.use('/', route);
app.use('/u', u);
app.use('/users', users);

//全局变量
app.locals.FormatDate = mycommon.FormatDate;


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
      title:"Xiaof's Error Page",
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

console.log("start");
module.exports = app;
