/**
 * Created by Ric on 13-11-12.
 */
var mongoose = require('mongoose');

var typeSchema = new mongoose.Schema({
    name:{type:String, unique:true},
    count:{type:Number, default: 0}
});

mongoose.model('Type',typeSchema);