/**
 * Created by Ric on 13-11-12.
 */
var models = require('../model');
var Type = models.Type;
var Article = models.Article;

exports.newType = function(name, callback){
    var type = new Type();
    type.name = name;
    type.save(callback);
};

exports.findAll = function(callback){
    Type.find(callback);
};

exports.findTypeByIds = function(ids, callback){
    var query = {
        $or:[]
    };
    for(var i = 0, len = ids.length; i < len; i++){
        query['$or'].push({
            _id:ids[i]
        });
    }
    Type.find(query,callback);
};

exports.findOneById = function(id, callback){
    Type.findById(id,callback);
};

exports.findOneByName = function(name, callback){
    Type.findOne({name: name}, callback);
};

exports.delType = function(id, callback){
    Type.remove({_id:id},callback);
}

exports.modifyType = function(id, name, callback){
    Type.findOne({_id: id},function(err, type){
        if(err){
            if(typeof(callback)=='function'){
                callback({err:"null"});
            }
        }
        type.name = name;
        type.save(callback);
    })
}

exports.addCount = function(id,callback){
    if(id.constructor == Array){
        for(var i=0;i<id.length;i++){
            Type.findOne({_id: id[i]},function(err, type){
                if(err){
                    return null;
                }
                type.count += 1;
                type.save(callback);
            });
        }
    }else{
        Type.findOne({_id: id},function(err, type){
            if(err){
                return null;
            }
            type.count += 1;
            type.save(callback);
        });
    }
}

exports.subCount = function(id,callback){
    if(id.constructor == Array){
        for(var i=0;i<id.length;i++){
            Type.findOne({_id: id[i]},function(err, type){
                if(err){
                    return null;
                }
                type.count -= 1;
                type.save(callback);
            });
        }
    }else{
        Type.findOne({_id: id},function(err, type){
            if(err){
                return null;
            }
            type.count -= 1;
            type.save(callback);
        });
    }

}