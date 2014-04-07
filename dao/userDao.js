/**
 * Created by wei.wang on 11/4/13.
 */
var models = require('../model');
var User = models.User;

exports.getUserByLoginName = function(loginName , callback ){
    User.findOne({'loginName': loginName}, callback);
};

exports.newUser = function(name , loginName , password , email, callback){
    var user=new User();
    user.name = name;
    user.loginName = loginName;
    user.password = password;
    user.email = email;
    user.save(callback);
};

exports.getUsersByQuery = function (query, callback) {
    User.find(query, callback);
};

exports.getUserCount = function(callback){
    User.count(callback);
}
