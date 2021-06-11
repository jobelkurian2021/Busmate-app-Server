const mongoose = require('mongoose')

// var Loginschema = new mongoose.Schema({
    
const Schema = mongoose.Schema;
let login = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique: true,
        required:true,
    },
    phone:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    usetype:{
        type:String,
        required:true
    },
    status: {
        type:String,
        default:'INACTIVE'
    },
    date: {
        type:Date,
        default:Date.now()
    },
    url: {
        type:String
        // required:true
    },
    OTP: {
        type:String,
        default:'not verified'
    }
});
module.exports = mongoose.model("user", login);
// mongoose.model("login", Loginschema) 
