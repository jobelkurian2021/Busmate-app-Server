const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
// require('./Employee')
const cors = require("cors");

app.use(bodyParser.json())

// const Employee = mongoose.model("employee")
app.use(cors());

// const mongoUri = "mongodb://localhost:27017/project"

// mongoose.connect(mongoUri,{
    mongoose.connect(process.env.MONGODB_URI || `mongodb://localhost:27017/project`);
    // useNewUrlParser:true,
    // useUnifiedTopology:true
// })

mongoose.connection.on("connected",()=>{
    console.log("connected to mongo yeahhh")
})
mongoose.connection.on("error",(err)=>{
    console.log("error",err)
})
app.get('/api/getList', (req,res) => {
    var list = ["item1", "item2", "item3"];
    res.json(list);
    console.log('Sent list of items');
});
app.get('/',(req,res)=>{
    User.find({}).then(data=>{
        res.send(data)
    }).catch(err=>{
        console.log(err)
    })
    
    
})


app.post('/api/signup',(req,res)=>{
     const user = new User({
         name:req.body.name,
         email:req.body.email,
         phone:req.body.phone,
         password:req.body.passord,
         city:req.body.city,
         state:req.body.city,
         usetype:req.body.city
     })
     user.save()
     .then(data=>{
         console.log(data)
         res.send(data)
     }).catch(err=>{
         console.log(err)
     })
     
})

app.post('/api/cprofile',(req,res)=>{
    const cprofile = new Cprofile({
        name:req.body.name,
        email:req.body.email,
        site:req.body.site,
        address:req.body.address,
        phone:req.body.phone,
        rid:req.body.rid,
        acc:req.body.acc,
        btype:req.body.btype,
        busno:req.body.busno
    })
    cprofile.save()
    .then(data=>{
        console.log(data)
        res.send(data)
    }).catch(err=>{
        console.log(err)
    })
    
  })
app.post('/send-data',(req,res)=>{
    const user = new User({
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        pass:req.body.pass,
        password:req.body.passord,
        city:req.body.city

    })
    user.save()
    .then(data=>{
        console.log(data)
        res.send(data)
    }).catch(err=>{
        console.log(err)
    })
    
})

app.post('/delete',(req,res)=>{
    User.findByIdAndRemove(req.body.id)
    .then(data=>{
        console.log(data)
        res.send(data)
    })
    .catch(err=>{
        console.log(err)
    })
})

app.post('/update',(req,res)=>{
    User.findByIdAndUpdate(req.body.id,{
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        pass:req.body.pass,
        password:req.body.passord,
        city:req.body.city
    }).then(data=>{
        console.log(data)
        res.send(data)
    })
    .catch(err=>{
        console.log(err)
    })
})

app.listen(3500,()=>{
    console.log("server running")
})
