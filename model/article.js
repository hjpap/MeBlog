/**
 * Created by Ric on 13-11-9.
 */
//var moment = require('moment');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
var Schema = mongoose.Schema;

var articleSchema = new mongoose.Schema({
    title:{ type: String },
    type:[{type:Schema.Types.ObjectId, ref:'Type'}],
    descript:{type: String },
    cover_img:{
        large:{ type:String },
        medium:{ type:String },
        small:{ type:String }
    },
    content:{ type: String },
    author:{ type: String },
    limit:{ type: String, default:1},//文章权限，1公开，2密码，3私人
    password:{ type: String },
    sortby: { type:String, default:255},//排序规则
    like: { type: Number, default: 0 },
    view: { type: Number, default:0 },
    comment: { type: Number, default:0},
    create_date: { type:Date, default:Date.now},
    date:{
       year:{ type:String , default:new Date().getYear() },
       month:{ type:String , default:new Date().getYear()+"-"+(new Date().getMonth()+1) },
       day:{ type:String , default:new Date().getYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDay() }
    }
});

mongoose.model('Article',articleSchema);