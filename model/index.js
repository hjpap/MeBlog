/**
 * Created by wei.wang on 11/4/13.
 */
var mongoose = require('mongoose');
var config = require('../config').config;

/*var db=mongoose.createConnection('localhost','MongoDB');
db.on('error',console.error.bind(console,'连接错误'));
db.once('open',function(){
    console.log('db open in :'+new Date());
});*/
mongoose.connect(config.db,function(err){
    if (err) {
        console.error('connect to %s error: ', config.db, err.message);
        process.exit(1);
    }
	console.log('connect to %s success.',config.db);
});

require('./user');
require('./article');
require('./type');

exports.User = mongoose.model('User');
exports.Article = mongoose.model('Article');
exports.Type = mongoose.model('Type');

