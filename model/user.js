/**
 * Created by wei.wang on 11/4/13.
 */
var mongoose=require('mongoose');

var userSchema=new mongoose.Schema({
    name: { type: String, index: true },
    loginName: { type: String, unique: true },
    password: { type: String },
    email: { type: String, unique: true }
});

mongoose.model('User',userSchema);