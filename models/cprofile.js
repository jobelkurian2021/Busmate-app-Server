
const mongoose = require('mongoose')

// var Loginschema = new mongoose.Schema({
    
const Schema = mongoose.Schema;
let cprofile = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    site:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    rid:{
        type:String,
        required:true
    },
    acc:{
        type:String,
        required:true
    },
    btype:{
        type:String,
        required:true
    },
    busno:{
        type:String,
        required:true
    }, 
    date: {
        type:Date,
        default:Date.now()
    },
});
module.exports = mongoose.model("cprofile", cprofile);
// mongoose.model("login", Loginschema) 
