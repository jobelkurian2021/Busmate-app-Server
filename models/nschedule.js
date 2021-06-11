const mongoose = require('mongoose')

    
const Schema = mongoose.Schema;
let nschedule = new Schema({
    routeid:{
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
    type:{
        type:String,
        required:true
    }, 
    starttime:{
        type:String,
        required:true
    }, 
    endtime:{
        type:String,
        required:true
    }, 
    stops: [
        {
        stop:{
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
    },
    {
        stop:{
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
    },
    {
        stop:{
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
    }
],
//     {"routeid":"1003","source":"Kottayam","destination":"Thrissur","type":"FP","starttime":"10:05","endtime":"16:20","stops":[{"stop":"ettumanoor","time":"10:25","fare":"15"},{"stop":"vaikam","time":"11:10","fare":"35"},{"stop":"ernakulam","time":"12:35","fare":"60"}
// ,{"stop":"Aluva","time":"13:55","fare":"85"},{"stop":"Thrissur","time":"15:45","fare":"125"}

// ]}
    // date: {
    //     type:Date,
    //     default:Date.now()
    // },
});
module.exports = mongoose.model("schedule", nschedule);
