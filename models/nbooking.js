
const mongoose = require('mongoose')
    
const Schema = mongoose.Schema;
let nbooking = new Schema({
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    source:{
        type:String,
        required:true
    },
    destination:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true
    },
    no:{
        type:String,
        required:true
    },
    accomodation:{
        type:String,
        required:true
    },
    seatno:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    sex:{
        type:String,
        required:true
    },
    age:{
        type:String,
        required:true
    },
    date: {
        type:Date,
        default:Date.now()
    },
});
module.exports = mongoose.model("booking", nbooking);
