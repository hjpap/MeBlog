/**
 * Created by wei.wang on 11/4/13.
 *
 * That should work if the dates you saved in the DB are without time (just day, month, year).

 Chances are that the dates you saved were new Date(), which includes the time components. To query those times you need to create a date range that includes all moments in a day.

 db.posts.find( //query today up to tonight
 {"created_on": {"$gte": new Date(2012, 7, 14), "$lt": new Date(2012, 7, 15)}})

 模糊查询

 通过MongoDB的特殊查询符 $or 与 正则表达式 配合查询：

 //node.js的正则表达式
 query = new RegExp '查询内容', 'i'
 //coffee
 exports.search = ( obj, query, random ) ->
 obj.find { '$or' : [{ 'title' : query }, { 'content' : query }] }, ( err, contents ) ->
 if not err
 exports.emit random + '_contents_search_success', contents
 else
 exports.emit random + '_contents_search_error', err
 //node.js
 obj.find({ '$or' : [{ 'title' : query }, { 'content' : query }] })
 *
 */
//相应的controller
var config = require('../config').config;
var Article = require('../dao/articleDao');
var Type = require('../dao/typeDao');
var EventProxy = require('eventproxy');

exports.articleList=function(req,res){
    var page = parseInt(req.query.p,10) || 1;
    var searchKey = req.query.searchkey || null;
    var filterDate = req.query.filterdate || "all";
    var filterTag = req.query.filtertag || "all";

    var pageSize = req.query.pageSize || config.articlePageSize;
    /*   ---query info---   */
    var query = null;
    if(searchKey != null){
        query = query || {};
        query.title = new RegExp(searchKey);
    }
    if(filterTag != "all"){
        query = query || {};
        query.type = filterTag;
    }
    if(filterDate != "all"){
        /*
        * db.posts.find( //query today up to tonight
         {"created_on": {"$gte": new Date(2012, 7, 14), "$lt": new Date(2012, 7, 15)}})
        * */
        query = query || {};
        query['date.month'] = filterDate;
    }
    /*   ---query info end---   */

    var render = function(articlesCount, articlesList, typesMap, dates){
        var articlesCount = articlesCount || 0;
        var pageCount =  articlesCount % pageSize == 0 ? parseInt(articlesCount / pageSize,10) : parseInt((articlesCount / pageSize) + 1,10);
        var pageData = {
            nowPage:page,
            pageSize: pageSize,
            articlesCount: articlesCount,
            pageCount: pageCount
        };

        res.render('admin/list',{
            articles: articlesList,
            pageData: pageData,
            typesMap:typesMap,
            dates:dates,
            searchKey: searchKey,
            filterDate: filterDate,
            filterTag: filterTag,
            siteInfo:config.siteInfo
        });
    }
    var ep = EventProxy.create('articlesCount', 'articlesList','typesMap',"dates", render);

    Article.getAllDates(function(err, dates){
        if(err){
            ep.emit('dates', null);
        }
        ep.emit('dates', dates);
    });

    Article.articleCount(query, function(err, count){
        if(err){
            ep.emit('articlesCount', null);
        }
        ep.emit('articlesCount', count);
    });

    Article.findByPage(query,'title type comment like view create_date', page, pageSize, function(err, articles){
        if(err){
            console.log(err);
            ep.emit('articlesList', null);
        }
        ep.emit('articlesList', articles);
    });

    Type.findAll(function(err, types){
        if(err){
            ep.emit('typesMap', null);
        }
        var typesMap = {
            types:types
        }
        ep.emit('typesMap', typesMap);
    });

};


