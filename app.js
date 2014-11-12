var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var datasetsRoutes = require('./routes/datasetsRoutes');
var elementsRoutes = require('./routes/elementsRoutes');

var app = express();
var mongo = require('mongoskin');

// Setup Database
//var db = mongo.db("mongodb://localhost:27017/opendataplus",{native_parser:true});
var db = mongo.db("mongodb://ds051970.mongolab.com:51970/odp",{native_parser:true});
/*
db.authenticate("odp", "Hack4art", function(error, result){
                 console.log("RESULT FROM DB authentication:", error, result)
               });
*/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//inject the database into the request
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/datasets', datasetsRoutes);
//app.use('/datasets/:dsname/elements', elementsRoutes);

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
