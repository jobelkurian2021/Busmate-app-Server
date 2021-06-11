const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BillTemplate=new mongoose.Schema({
    billid:{
        type:String,
         required:true
       },
    productId: {
        type: Schema.Types.ObjectId,
        ref: "product"
    },
    source:{
        type:String
    },
    destination:{
        type:String
    },
    userid: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    date: {
        type:Number,
        default:Date.now
    },
    Totalprice: {
        type:Number,
        required:true
    },
    noofpassengers: {
        type:Number,
        default:1
    },
    status: {
        type:Number,
        default:0
    },
});

module.exports=mongoose.model('Bill',BillTemplate)