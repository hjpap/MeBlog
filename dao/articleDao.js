/**
 * Created by Ric on 13-11-9.
 */
var config = require('../config').config;
var models = require('../model');
var TypeDao = require('../dao/typeDao');
var Article = models.Article;

exports.newArticle = function( title, type, content, author, limit, password, sortby, create_date, callback){
    var article = new Article();
    article.title = title;
    article.type = type;
    article.content = content;
    article.author = author;
    article.limit = limit;
    article.password = password;
    article.sortby = sortby;
    var newTime = new Date(create_date);
    article.create_date = newTime;
    article.date.year = newTime.getFullYear();
    article.date.month =  newTime.getFullYear()+"-"+(newTime.getMonth()+1) ;
    article.date.day =  newTime.getFullYear()+"-"+(newTime.getMonth()+1)+"-"+newTime.getDate();
    TypeDao.addCount(type);
    article.save(callback);
}

exports.del = function(id,callback){
    Article.findById(id,function(err,article){
        if(err)
            return;
        TypeDao.subCount(article.type);
        Article.remove({_id:id},callback);
        //article.remove();
    })
}

exports.findByIdWithType = function(id, callback){
    Article.findById(id).populate('type').exec(callback);
}

exports.findById = function(id, callback){
    Article.findById(id).exec(callback);
}

exports.findByIdWidthFields = function(id,fields, callback){
    Article.findById(id,fields).exec(callback);
}

exports.findByPage = function(query, fields, page, pageSize, callback){
    var pageSize = pageSize;
    var start = (page - 1) * pageSize;
    Article.find(query, fields).sort({sortby: 'asc',create_date:'desc'}).skip(start).limit(pageSize).populate('type').exec(callback);
}

exports.articleCount = function(query, callback){
    Article.count(query,callback);
}
exports.findAll = function(query, fields, sort, callback){
    sort = sort || {sortby: 'asc',create_date:'asc'};
    Article.find(query, fields).sort(sort).exec(callback);
}

exports.modify = function(aid, title, type, content, author, limit, password, sortby, create_date, callback){
    Article.findOne({_id: aid},function(err, article){
        if(err){
            if(typeof(callback)=='function'){
                callback({err:"null"});
            }
        }
        TypeDao.subCount(article.type,function(){
            TypeDao.addCount(type);
        });
        article.title = title;
        article.type = type;
        article.content = content;
		article.author = author;
        article.limit = limit;
        article.password = password;
        article.sortby = sortby;
        var newTime = new Date(create_date);
        article.create_date = newTime;
        article.date.year = newTime.getFullYear();
        article.date.month =  newTime.getFullYear()+"-"+(newTime.getMonth()+1) ;
        article.date.day =  newTime.getFullYear()+"-"+(newTime.getMonth()+1)+"-"+newTime.getDate();
        article.save(callback);
    })
}

exports.getAllDates = function(callback){
    Article.distinct('date.month').exec(function(err, dates){
        function desc(x,y){
            if (x > y)
                return -1;
            if (x < y)
                return 1;
        }
        if(dates)dates.sort(desc);
        callback(err, dates);
    });
}