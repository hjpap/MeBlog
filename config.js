/**
 * Created by wei.wang on 11/4/13.
 */
exports.config = {

    siteInfo:{
		siteURL:"http://10.20.3.51:3000",
        siteStaticURL:"http://10.20.3.51:3000",
        title:"Me.",
        description:"Wei's Blog"
    },
    session_secret:"ricw",
    session_maxAge:30000,

    db: 'mongodb://10.20.3.51/MongoDB',

    articlePageSize:10

}
