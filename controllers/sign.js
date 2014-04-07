/**
 * Created by wei.wang on 11/4/13.
 */
var config = require('../config').config;
var User = require('../dao/userDao');
var crypto=require('crypto');

exports.signUp = function(req,res,next){
    var loginName = req.body.loginName;
    var pass = req.body.password;
    var repass = req.body['re-password'];
    var name = req.body.name;
    var email = req.body.email;
    if (loginName==='' || name === '' || pass === '' || repass === '' || email === '') {
        return res.render('signup', {error: '信息不完整。',siteInfo:config.siteInfo});
    }
    if (pass !== repass) {
        return res.render('signup', {error: '两次密码输入不一致。',siteInfo:config.siteInfo});
    }
    User.getUsersByQuery({'$or':[{'loginName':loginName},{'email':email}]},function(err, users){
        if (err) {
            return res.render('signup', {error: '注册失败。',siteInfo:config.siteInfo});
        }
        if (users.length > 0) {
            return res.render('signup', {error: '用户名或邮箱已被使用。',siteInfo:config.siteInfo});
        }

        pass = md5(pass);
        User.newUser(name, loginName, pass, email, function(err){
            if(err){
                return res.render('signup', {error: '注册失败。',siteInfo:config.siteInfo});
            }
            res.redirect('/');
        })
    });
};

var notJump = [];
exports.logIn = function(req,res){
    var loginName=req.body.loginname;
    var pass=req.body.password;
    User.getUserByLoginName(loginName,function(err,user){
        if(err){
            res.render('login',{error:'登录失败',siteInfo:config.siteInfo});
            return;
        }
        if(!user){
            res.render('login',{error:'用户名或密码错误',siteInfo:config.siteInfo});
            return;
        }
        pass = md5(pass);
        if(pass !== user.password){
            res.render('login',{error:'用户名或密码错误',siteInfo:config.siteInfo});
            return;
        }
        req.session.userInfo = user;
        /*
        var refer = req.session.referer || '/';
        req.session.userInfo = user;
        for (var i = 0, len = notJump.length; i !== len; ++i) {
            if (refer.indexOf(notJump[i]) >= 0) {
                refer = '/';
                break;
            }
        }
        */
        res.redirect("/adminlist");
    });

};

exports.toLogin = function(req,res){
    req.session._loginReferer = req.headers.referer;
    console.log("referer:"+req.headers.referer);
    res.render('login',{error:null,siteInfo:config.siteInfo});
};

exports.toSignUp = function(req,res){
    User.getUserCount(function(err,count){
        if(err){
            res.redirect('/');
        }
        if(count>0){
            res.redirect('/');
        }else{
            res.render('signup',{error:null,siteInfo:config.siteInfo});
        }
    })
};

exports.logOut = function(req,res){
    req.session = null;
    res.redirect('/');
}

function md5(str){
    var md5sum = crypto.createHash('md5');
    md5sum.update(str);
    str = md5sum.digest('hex');
    return str;
}

