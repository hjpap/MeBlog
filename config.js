/**
 * Created by wei.wang on 11/4/13.
 */
exports.config = {

    siteInfo:{
        //siteURL:"http://ricwme.duapp.com",
		siteURL:"http://10.20.3.51:3000",
        //siteStaticURL:"http://ricwme.duapp.com",
        siteStaticURL:"http://10.20.3.51:3000",
        title:"Me.",
        description:"Wei's Blog"
    },
    session_secret:"ricw",
    session_maxAge:30000,

    db: 'mongodb://10.20.3.51/MongoDB',
	//db: 'mongodb://wei.wang:vib1234567@localhost/MongoDB',
	//db:"mongodb://0Flba18fyozvD2enbIlcA1OR:yXWqzG60CS0NqslILRhlDBZlc7kTnEWg@mongo.duapp.com:8908/KeKkpbolakTqtFRuxXVX",
    articlePageSize:10

}
