/**
 * Created by wei.wang on 11/4/13.
 */
exports.config = {

    siteInfo:{
		siteURL:"http://10.20.3.141:3000",
        siteStaticURL:"http://10.20.3.141:3000",
        title:"Me.",
        description:"Wei's Blog"
    },
    session_secret:"ricw",
    session_maxAge:30000,

    db: 'mongodb://10.20.3.141/ohric',

    articlePageSize:10,

    qn:{
        'ACCESS_KEY': 'Kmn0sRXe8SykNlool9tYBVTT8Vjrpv8Wedch42R8',
        'SECRET_KEY': 'XcDURZQ2i89hzl98o_4jX5Hpe56UuxkPOd6xKaJw',
        'Bucket_Name': 'ricw',
        'Uptoken_Url': '/uptoken',
        'Domain': 'ricw.u.qiniudn.com'
    }

}
