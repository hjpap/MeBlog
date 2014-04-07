/**
 * Created by Ric on 13-11-12.
 */
var Type = require('../dao/typeDao');
var config = require('../config').config;
exports.addType = function(req, res){
    var typeStr = req.query.typeName;
    if(typeStr==undefined || typeStr==""){
        res.json({status:"error"});
        return;
    }
    Type.findOneByName(typeStr,function(err,type){
        if(err){
            res.json({status:"error"});
            return;
        }
        if(type){
            res.json({status:"have"});
            return;
        }
        Type.newType(typeStr,function(err, newType){
            if(err){
                return;
            }
            res.json({status:'success',data:newType});
        });
    })
};

exports.modifyType = function(req, res){
    var typeStr = req.query.typeName;
    var tid = req.query.id;
    if(typeStr==undefined || typeStr==""){
        res.json({status:"error"});
        return;
    }
    Type.findOneByName(typeStr,function(err,type){
        if(err){
            res.json({status:"error"});
            return;
        }
        if(type){
            res.json({status:"have"});
            return;
        }
        Type.modifyType(tid,typeStr,function(err, type){
            if(err){
                res.json({status:"error"});
                return;
            }
            res.json({status:'success',data:type});
        });
    })
};

exports.ajaxGetType = function(req, res){
    Type.findAll(function(err, types){
        if(err){
            res.json({status:"error"});
            return;
        }
        res.json({status:"success",data:types});
    })
}

exports.toTypeList = function(req, res){
    Type.findAll(function(err, types){
        if(err){
            res.json({status:"error"});
            return;
        }
        res.render('admin/taglist',{tags:types,siteInfo:config.siteInfo});
    })
}

exports.delType = function(req, res){
    var id = req.params.id;
    Type.delType(id, function(){
        res.redirect('/taglist');
    });
}