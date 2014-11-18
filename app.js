/**
 * Author wei.wang
 */

var express = require('express');
var path = require('path');
var config = require('./config').config;

var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(methodOverride());
app.use(session({ resave: true,
    saveUninitialized: true,
    secret: config.session_secret }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(errorHandler());
}

require('./router')(app);
//捕获异常(抛出所有异常)
process.on('uncaughtException',function(err){
    console.log('Caught exception:'+err);
});
app.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

