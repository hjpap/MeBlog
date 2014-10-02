var config = require('../config').config;
var qiniu = require('qiniu');

qiniu.conf.ACCESS_KEY = config.qn.ACCESS_KEY;
qiniu.conf.SECRET_KEY = config.qn.SECRET_KEY;
var uptoken = new qiniu.rs.PutPolicy(config.qn.Bucket_Name);
exports.uptoken = function(req, res){
    var token = uptoken.token();
    res.header("Cache-Control", "max-age=0, private, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);
    if (token) {
        res.json({
            uptoken: token
        });
    }
}

exports.upload = function(req, res){
    res.render('upload',{
        siteInfo:config.siteInfo,
        domain: config.qn.Domain,
        uptoken_url: config.qn.Uptoken_Url
    });
}

