/**
 * Created by wei.wang on 11/4/13.
 *
 * That should work if the dates you saved in the DB are without time (just day, month, year).

 Chances are that the dates you saved were new Date(), which includes the time components. To query those times you need to create a date range that includes all moments in a day.

 db.posts.find( //query today up to tonight
 {"created_on": {"$gte": new Date(2012, 7, 14), "$lt": new Date(2012, 7, 15)}})
 *
 */
//相应的controller
var config = require('../config').config;
var Article = require('../dao/articleDao');
var Type = require('../dao/typeDao');
var EventProxy = require('eventproxy');

exports.index=function(req,res){
   res.render('index',{
       siteInfo:config.siteInfo
   });
};

exports.toArticle=function(req,res){
    var aid = req.params.id;
    Article.findByIdWidthFields(aid,"title descript type create_date limit",function(err,article){
        var articleInfo = article;
        if(err){
            articleInfo = null;
        }
        res.render('article',{
            articleId: aid,
            siteInfo:config.siteInfo,
            articleInfo:articleInfo
        });
    });
};

exports.toTag=function(req,res){
    Type.findAll(function(err,types){
        if(err){
            res.render('tag',{
                type:null,
                err:err,
                siteInfo:config.siteInfo
            });
        }
        res.render('tag',{
            types:types,
            siteInfo:config.siteInfo
        });
    })
};

exports.toList=function(req,res){
    var tid = req.params.id || null;
    res.render('list',{
        tagId: tid,
        siteInfo:config.siteInfo
    });
};

exports.toArchived = function(req, res){
    Article.getAllDates(function(err, dates){
        if(err){
            res.render('archived',{
                siteInfo:config.siteInfo,
                dates:null,
                articles:null
            });
        }
        if(dates && dates.length>0){
            var convertDates = {};
            for(var i=0,l=dates.length;i<l;i++){
                var date = dates[i].split('-');
                var y = date[0], m = date[1];
                if(!convertDates[y])
                    convertDates[y]=[];
                convertDates[y].push(m);
            }
        }else{
            convertDates=null;
        }
        Article.findAll(null,"title type date limit",{create_date:'asc'}, function(err, articles){
            var convertArticles = {};
            if(articles && articles.length>0){
                for(var i= 0,l=articles.length;i<l;i++){
                    var d = articles[i].date.month.split('-');
                    var year = d[0];
                    var month = d[1];
                    if(!convertArticles[year])
                        convertArticles[year]={};
                    if(!convertArticles[year][month])
                        convertArticles[year][month] = [];
                    convertArticles[year][month].push(articles[i]);
                }
            }else{
                convertArticles=null;
            }
            res.render('archived',{
                siteInfo:config.siteInfo,
                dates:convertDates,
                articles:convertArticles
            });
        });
    });
}

exports.toResume = function(req, res){
    res.render('resume',{
        siteInfo:config.siteInfo
    });
}

exports.to404 = function(req,res){
    res.render('404',{
        siteInfo:config.siteInfo
    });
}