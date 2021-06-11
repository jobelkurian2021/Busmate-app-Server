const mongoose = require('mongoose')

// var Loginschema = new mongoose.Schema({
    
const Schema = mongoose.Schema;
let nroute = new Schema({
    source:{
        type:String,
        required:true
    }, 
    destination:{
        type:String,
        required:true
    }, 
    type:{
        type:String,
        required:true
    }, 
    time:{
        type:String,
        required:true
    }, 
    fare:{
        type:String,
        required:true
    }, 
    date: {
        type:Date,
        default:Date.now()
    },
});
module.exports = mongoose.model("route", nroute);
// mongoose.model("login", Loginschema) 
