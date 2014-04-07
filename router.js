//所有路由映射配置
var sign = require('./controllers/sign');
var site = require('./controllers/site');
var admin = require('./controllers/admin');
var article = require('./controllers/article');
var type = require('./controllers/type');
var config = require('./config').config;

var adminRequired = function (req, res, next) {
    if (!req.session.userInfo) {
        req.session.referer = req.url;
        return res.render('login', {error: '你还没有登录。', siteInfo:config.siteInfo});
    }
    next();
};

module.exports=function(app){
    app.get('/', site.index);
    app.get('/a/:id', site.toArticle);
    app.get('/tag/:id', site.toList);
    app.get('/list', site.toList);
    app.get('/tag', site.toTag);
    app.get('/archived', site.toArchived);
    app.get('/resume', site.toResume);

    app.get('/modify/:id',adminRequired, article.toModify);
    app.get('/post',adminRequired, article.post);
    app.post('/articleForm',adminRequired, article.articleForm);
    app.post('/modifyArticleForm',adminRequired, article.articleForm);
    app.get('/addType',adminRequired, type.addType);
    app.get('/ajaxGetType',adminRequired, type.ajaxGetType);

    app.get('/adminlist', adminRequired, admin.articleList);
    app.get('/taglist',type.toTypeList);
    app.get('/del/:id',adminRequired, article.del);
    app.get('/deltag/:id',adminRequired, type.delType);
    app.get('/modifyTag',adminRequired, type.modifyType);

    app.get('/toLogin', sign.toLogin);
    app.get('/set', sign.toSignUp);
    app.get('/logout', sign.logOut);
    app.post('/login', sign.logIn);
    app.post('/signup', sign.signUp);

    // json------------
    app.get('/getArticle', article.getArticle);
    app.get('/getArticles', article.getArticles);
    app.get('/ddd',function(req, res){
        res.render('demo/facebookApi');
    });

    app.get('*',site.to404);

}