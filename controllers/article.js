/**
 * Created by Ric on 13-11-10.
 */
var config = require('../config').config;
var msgTag = 'controllers/article';
var ArticleDao = require('../dao/articleDao');
var Type = require('../dao/typeDao');
var EventProxy = require('eventproxy');
//json getArticles

exports.getArticles = function(req,res){
    var page = parseInt(req.query.p,10) || 1;
    var tag =req.query.tag;
    var fields = null;
    var pageSize = req.query.pageSize || config.articlePageSize;
    if(req.query.fields){
        fields = "title type comment like view sortby date create_date";
    }
    var query = {
        $or:[{limit:"1"},{limit:"2"}]
    };
    if(tag){
        query["type"]=tag;
    }
    var render = function(articlesCount, articlesList){

        var articlesCount = articlesCount || 0;
        var pageCount =  articlesCount % pageSize == 0 ? parseInt(articlesCount / pageSize) : parseInt((articlesCount / pageSize) + 1);
        var pageData = {
            nowPage:page,
            pageSize: pageSize,
            articlesCount: articlesCount,
            pageCount: pageCount
        };

        res.json({
            articles: articlesList,
            pageData: pageData
        });
    }
    var ep = EventProxy.create('articlesCount', 'articlesList',render);

    ArticleDao.articleCount(query, function(err, count){
        if(err){
            res.json({
                err:"getDataErr"
            });
        }
        ep.emit('articlesCount', count);
    });

    ArticleDao.findByPage(query, fields, page, pageSize, function(err, articles){
        if(err){
            console.log('%s, Find article by page err :'+err, msgTag);
            res.json({
                err:"getDataErr"
            });
        }
        ep.emit('articlesList', articles);
    });

};

//post 文章 form提交
exports.articleForm = function(req, res){
    var referer = req.session.referer;

    var target = referer?referer:"adminlist";

    var aid = req.body.aid || null;

    var title = req.body.title.trim();

    var type = req.body.type;

    var content = req.body.mytext;

    var limit = req.body.limit.trim() || 1;

    var password = req.body.articlepwd.trim();

    var sortby = req.body.sortBy.trim() || 255;

    var create_date = req.body.postTime.trim();

    var author = req.session.userInfo.loginName;

    if(aid){
        ArticleDao.modify(aid, title, type, content, author, limit, password, sortby, create_date,function(err, article){
            if(err){
                res.redirect('/modify/'+aid);
            }
            res.redirect(target);
        });
    }else{
        ArticleDao.newArticle(title, type, content, author, limit, password, sortby, create_date, function(err){
            if(err){
                console.log('%s, add article err :'+err, msgTag);
            }else{
                console.log('%s, add article success', msgTag);
                res.redirect('adminlist');
            }
        });
    }
}

//删除文章
exports.del = function(req, res){
    var id = req.params.id;
    ArticleDao.del(id,function(err){
        if(err){
            res.send("删除失败");
            console.log('%s, del article fail', msgTag);
        }
        res.redirect('adminlist');
    });
}

exports.getArticle = function(req, res){
    var aid = req.query.id;
    ArticleDao.findByIdWithType(aid, function(err, article){
        if(err){
            console.log('%s, get a article err :'+err, msgTag);
            return;
        }
        if(!article){
            console.log('%s, no article :'+err, msgTag);
            return;
        }
        res.json({
            article:article
        });
    });
}

exports.post = function(req, res){
    req.session.referer = req.headers.referer;
    res.render('admin/post',{
        siteInfo:config.siteInfo
    });
}

exports.toModify = function(req, res){
    req.session.referer = req.headers.referer;
    var aid = req.params.id;
    ArticleDao.findById(aid, function(err, article){
        if(err){
            console.log('%s, Get a article err :'+err, msgTag);
            return;
        }
        if(!article){
            console.log('%s, no article :'+err, msgTag);
            return;
        }

        res.render('admin/modify',{
            article:article,
            siteInfo:config.siteInfo
        });
    });
}

exports.getAllDates = function(req, res){
    ArticleDao.getAllDates(function(err, dates){
        if(err){
            res.json({status:"error"});
            return;
        }
        res.json({status:'success',data:dates});
    });
}