const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const app = express();
const cors = require("cors");
const mongoose = require('mongoose');
const expressValidator = require("express-validator");
const nodemailer = require("nodemailer");

const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require('crypto');

// const loginRouter = require('./routes/loginrouter')
require("dotenv").config();




const PORT= process.env.PORT || 3500;

app.use(cors());

// mongoose.Promise = global.Promise;
// mongoose.connect(process.env.MONGODB_URI || `mongodb://localhost:27017/project`);

app.use(bodyParser.json());
// app.use('/api', loginRouter);
app.use(express.json());
// app.use(expressValidator());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const Login = require("./models/login");
let Cprofile = require("./models/cprofile");
let Nroute = require("./models/nroute");
let Nbooking = require("./models/nbooking");
let feedback = require("./models/nfeedback");
let Nschedule = require("./models/nschedule");
let Nlocation = require("./models/Location");
let Bus= require("./models/Bus");
let busSchema= require("./models/Bus");
let Cart = require("./models/cart");
let Bill = require("./models/Bill");

const payment=require('./routes/payment');
const bill=require('./routes/bill');

// const MongoClient = require('mongodb').MongoClient;
// // const uri = "mongodb+srv://jobelkurian@gmail.com:Ht%WS45wFe7$%-A@cluster0.fgvkr.mongodb.net/BusmateApp?retryWrites=true&w=majority";
// const uri = "mongodb+srv://jobel7:5w5Cu9FHv4M3NakS@cluster0.fgvkr.mongodb.net/BusmateApp?authSource=admin&replicaSet=atlas-11blwb-shard-0&readPreference=primary&ssl=true";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true },
//    (err) => {
//     if (!err) { console.log('Successfully Connected in MongoDB') }
//     else { console.log('Syntax Error: ' + err) }
// }
//   );
//   client.connect(err => {
//     const collection = client.db("project").collection("users")
//     // perform actions on the collection object
//     .then(db => console.log('DB conectada'))
//     .catch(err => console.log(error));
//     // client.close();
//   });

mongoose.connect(
  // "mongodb://127.0.0.1:27017/project", 
  process.env.MONGO_BASE_ACCESS,
  {
    useUnifiedTopology: true, 
    useNewUrlParser: true, 
    useCreateIndex: true 
    }, (err) => {
        if (!err) { console.log('Successfully Connected in MongoDB') }
        else { console.log('Syntax Error: ' + err) }
});


const connection = mongoose.connection;

connection.once("open", function() {
    console.log("Connection with MongoDB was successful");
  });

// const port = process.env.PORT || 5000;

app.use("/", router);

app.use("/api/bus", require("./routes/bus"));
app.use("/api/locations", require("./routes/location"));
app.use("/api/travels", require("./routes/travel"));
app.use("/api/Location", require("./routes/location"));
app.use('api/payment', require('./routes/payment'));
app.use('api/payment',payment);
app.use('/bill',bill);


app.listen(PORT,function(){
    console.log('App is listening on port ' + PORT);
});

router.route("/getData").get(function(req, res) {
Login.find({}, function(err, result) {
    if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
});

app.post('/send-data',(req,res)=>{
  const login = new Login({
      name:req.body.name,
      email:req.body.email,
      phone:req.body.phone,
      pass:req.body.pass,
      password:req.body.passord,
      city:req.body.city

  })
  login.save()
  .then(data=>{
      console.log(data)
      res.send(data)
  }).catch(err=>{
      console.log(err)
  })
  
})

app.post('/api/signup',async (req,resp)=>{
  const salt = await bcrypt.genSalt(10);
  const securepassword = await bcrypt.hash(req.body.password, salt);
  const login = new Login({
      name:req.body.name,
      email:req.body.email,
      phone:req.body.phone,
      password: securepassword,
      state:req.body.state,
      city:req.body.city,
      usetype:req.body.usetype
  })
  login.save()
  .then(data=>{
      console.log(data)
      // res.send(data)
      resp.status(200).json({ message: "user registered"});
  })
  .catch((error) => {
    resp.status(400).json({ error: error, message: " error " });
  });
});


app.post("/api/forgotpassword", async (req, resp) => {
  try {
    Login
      .findOne({ email: req.body.email })
      .then((Login,err) => {
        if (err) {
          resp.json({ message: "server error " });
        } 
        if (Login) {
              if (Login.OTP=="not verified") {
                resp.status(200).json({ error: err, message: "NoT verified email" });
              }else{

                let info = { email: req.body.email, password: Login.password };
                const token = jwt.sign(info, process.env.JWTSECRETKEY,{ expiresIn: 5 * 60 });

            const transport = nodemailer.createTransport({
                host: process.env.MAIL_HOST,
                auth: {
                  user: process.env.MAIL_USER,
                  pass: process.env.MAIL_PASS,
                },
              });
              var mailoptions = {
                from: process.env.MAIL_FROM,
                to: req.body.email,
                subject: "Forgot password",
                html: `<p>Token to reset Password.Copy the below token to reset your password</p><br><h3>Token:<strong>${token}</strong></h3><br>
                 <p>The token will expire in 5 minutes. </p>`,
              };
  
             transport.sendMail(mailoptions, function (err,response){
                if (err) {
                  console.log(err)
                  resp.status(200).json({ error: err, message: "email server error" });
                } else {
                  resp.status(200).json({
                    message: "Token sended",
                    token:"tokensended",
                  });
                  console.log("tokensended");
                }
              });
            } 
        } else {
          resp.status(200).json({
            message: "Email is not Registered",
          });
          console.log("invalid Email");
        }
      });
  } catch (error) {
    console.log("email error");
    return resp
      .status(400)
      .json({ error: err, message: "email and password needed" });
  }
});

router.post("/api/newpassword" ,async (req, resp) => {

  const salt = await bcrypt.genSalt(10);
  const securepassword = await bcrypt.hash(req.body.newpassword, salt);

  jwt.verify(req.body.token,process.env.JWTSECRETKEY,function(err, decoded) {
   if (err) {
    resp.json({ message: err.message });
   }
   else{ 
     const query = { email: decoded.email,password:decoded.password };
     const update = {
       $set: {
         password:securepassword
       },
     };
     const options = { returnNewDocument: true };
     return Login
       .findOneAndUpdate(query, update, options)
       .then((updatedDocument) => {
         if (updatedDocument) {
          resp.json({ message: "password updated"});
 
         } else {
           resp.status(200).json({ message: "server error" });
         }
         return updatedDocument;
       })
       .catch((err) =>
         console.error(`Failed to find and update document: ${err}`)
       ); 
   }
 });
 });

app.post("/api/signin", async (req, resp) => {
  try {
    Login
      .findOne({ email: req.body.email })
      .then((Login) => {
        if (Login) {
          bcrypt.compare(
            req.body.password,
            Login.password,
            (err, result) => {
              if (err) {
                resp.status(200).json({ error: err, message: "server error" });
              }
              if (result) {
                resp.status(200).json({
                  message: "validuser",
                  email: req.body.email,
                  data:Login,
                });
                console.log("success login");
                const payload = {
                  name: result.name,
                  email: result.email,
                  usetype: result.usetype
                };
              
                // const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '2h' });
              
                // return resp.json({ token });
              }
              if (!result) {
                resp.status(200).json({
                  message: "invalid password",
                });
                console.log("invalid password");
              }
            }
          );
        } else {
          resp.status(200).json({
            message: "invalid Email",
          });
          console.log("invalid Email");
        }
      });
  } catch (error) {
    console.log("email error");
    return resp
      .status(400)
      .json({ error: err, message: "email and password needed" });
  }
});

app.post("/api/payment/orders", async (req, res) => {
  try {
      const instance = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_SECRET,
      });

      const options = {
          amount: parseInt(req.body.rps)*100, // amount in smallest currency unit
          currency: "INR",
          receipt: req.body.loginid,
      };

      const order = await instance.orders.create(options);

      if (!order) return res.status(500).send("Some error occured");

      res.json(order);
  } catch (error) {
      res.status(500).send(error);
  }
});


app.get("/api/billGet",  (req, resp) => {
  try{
    // Nbooking.find({email:req.body.email}).populate('email')
    // Nbooking.findOne({email:{$eq:"jobelkurian@gmail.com"}}).populate('emailid')
        // Nbooking.find({email:{$ne:"jobelkurian77@gmail.com"}}).populate('emailid')
    Nbooking.find({email:{$eq:"jobelkurian@gmail.com"}}).populate('emailid')

  .exec((err,billdata)=>{
     if(err){
      resp.json( {message : "bill section empty"});
     }else{
         resp.json(billdata);
     }
  });
  }
  catch(error){
      return resp
      .status(400)
      .json({ error: err, message: "Error fetching data" });
  }
});


app.put("/api/billsubmit",async (req,resp) => {
  try {
    console.log(req.body)
    const filter = {userid:req.body.user,status:0};
    // Set some fields in that document
    const update = {
      "$set": {
        "status":1
      }
    };
    // Return the updated document instead of the original document
    const options = { returnNewDocument: true };
    return Cart.updateMany(filter, update, options)
      .then(updatedDocument => {
        if(updatedDocument) {
          resp.status(200).json({ message: "billed"});

          console.log(`Successfully updated document: ${updatedDocument}.`)
        } else {
          resp.status(200).json({ message: "bill not submitted"});
          console.log("bill not submitted")
        }
        return updatedDocument
      })
      .catch(err => console.error(`Failed to find and update document: ${err}`))
    
} catch (error) {
  return resp
    .status(400)
    .json({ error: error, message: "Error updating" });
}
  });
  
  app.get("/api/bill/history", async (req, resp) => {
    try{
      Nbooking.find({})
    .exec((err,billdata)=>{
       if(err){
        resp.json( {message : "bill section empty"});
       }else{
           resp.json(billdata);
       }
    });
    }
    catch(error){
        return resp
        .status(400)
        .json({ error: err, message: "Error fetching data" });
    }
  });

  app.post("/api/payment/success", async (req, res) => {
    try {
    
        const shasum = crypto.createHmac("sha256", `${process.env.RAZORPAY_SECRET}`);

        shasum.update(`${req.body.orderCreationId}|${req.body.razorpayPaymentId}`);

        const digest = shasum.digest("hex");

 
        if (digest === req.body.razorpaySignature)
       {
                if(req.body.payfrom==="cart")
                {
                                          try {        
                                    console.log(req.body)
                                            // const query = { customerid:req.body.user,status:"cart"};
                                            // const update = {
                                              const create = new Cart({ 
                                            // "$set": {
                                                "email":req.body.user,
                                                "totalprice":"50",
                                                "status":"cashpayed",
                                                "payorderid":req.body.razorpayOrderId,
                                                "payementid":req.body.razorpayPaymentId,
                                                "name":req.body.name,
                                                "source":req.body.source,
                                                "destination":req.body.destination,
                                              })
                                            // }
                                            // };
                                            // create.save()
                                            //           .then(data=>{
                                            //               console.log(data)
                                            //               // res.send(data)
                                            //               resp.status(200).json({ message: "user registered"});
                                            //           })
                                            const options = { returnNewDocument: true };
                                            // return Cart.updateMany(query, update,options)
                                            create.save()
                                            .then(
                                                (updatedDocument2) => {
                                                if(updatedDocument2) {
                                                res.status(200).json({
                                                  msg: "successfully payed",
                                                  orderId: req.body.razorpayOrderId,
                                                  paymentId: req.body.razorpayPaymentId,
                                                  user:req.body.email,
                                                  payfrom:req.body.payfrom,
                                              });

                                                } else {
                                                res.status(200).json({ message: "payement canceled"});
                                                }
                                                return updatedDocument2
                                            });
                                            
                                
                                } catch (error) {
                                    return res
                                    .status(400)
                                    .json({ error: error, message: "Error fetching data" });
                             }
                }
      }else{
        return res.status(400).json({ msg: "Transaction not legit!" });
      }
      
      } catch (error) {
          res.status(500).send(error);
    }
  });

  app.get("/api/payment/history", async (req, resp) => {
    try{
      Cart.find({})
    .exec((err,billdata)=>{
       if(err){
        resp.json( {message : "No Payment History Found"});
       }else{
           resp.json(billdata);
       }
    });
    }
    catch(error){
        return resp
        .status(400)
        .json({ error: err, message: "Error fetching data" });
    }
  });



  app.post("/api/otpresend", async (req, resp) => {
    try {
      Login
        .findOne({ email: req.body.email })
        .then((Login,err) => {
          if (err) {
            resp.json({ message: "server error " });
          } 
          if (Login) {
                if (Login.OTP==="verified") {
                  resp.status(200).json({ error: err, message: "Aleardy verified" });
                }else{
  
                  let info = { email: req.body.email, password: Login.password };
                  const token = jwt.sign(info, process.env.JWTSECRETKEY,{ expiresIn: 5 * 60 });
                  let url = `http://localhost:3500/api/verify?token=${token}`;
    
            
              const transport = nodemailer.createTransport({
                  host: process.env.MAIL_HOST,
                  auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                  },
                });
                var mailoptions = {
                  from: process.env.MAIL_FROM,
                  to: req.body.email,
                  subject: "BusMate Email verification (OTP)",
                  html: `<p>Click below link to verify your account in Busmate</>
                  <h3><a href="${url}">click here</a></h3>
                  <p>Busmate Team</p>`,
                };
    
               transport.sendMail(mailoptions, function (err,response){
                  if (err) {
                    console.log(err)
                    resp.status(200).json({ error: err, message: "email server error" });
                  } else {
                    resp.status(200).json({
                      message: "resended"
                    });
                    console.log("resended");
                  }
                });
              } 
          } else {
            resp.status(200).json({
              message: "invalid Email",
            });
            console.log("invalid Email");
          }
        });
    } catch (error) {
      console.log("email error");
      return resp
        .status(400)
        .json({ error: err, message: "email and password needed" });
    }
  });

  app.get("/api/verify" ,async (req, resp) => {
    jwt.verify(req.query.token,process.env.JWTSECRETKEY,function(err, decoded) {
     if (err) {
       console.log(err.message)
         resp.send(`<html> 
           <body>
           <h1>${err.message}</h1>
           </body>
       </html>`);
     }
     else{            
       const query = { email: decoded.email,password:decoded.password };
       const update = {
         $set: {
           OTP: "verified"
         },
       };
       const options = { returnNewDocument: true };
       return Login
         .findOneAndUpdate(query, update, options)
         .then((updatedDocument) => {
           if (updatedDocument) {
                resp.send(`<html> 
                 <body>
                 <h1>Email verified.Use the below Link to Login.</h1></br>
                 <p><a href="http://localhost:5000/login">click here</a></p>
                 <p>BusMate Team.</p>
                 </body>
             </html>`);
   
           } else {
             resp.status(200).json({ message: "server error" });
           }
           return updatedDocument;
         })
         .catch((err) =>
           console.error(`Failed to find and update document: ${err}`)
         ); 
     }
   });
   });

app.post('/api/addbus',async (req,resp)=>{
  const bus = new Bus({
    name:req.body.name,
    busNumber:req.body.bno,
    type:req.body.type,
    startLocation:req.body.sourcedrop,
    endLocation:req.body.destinationdrop,
    travel:req.body.travels,
    journeyDate:req.body.date,
    departure_time:req.body.time,
    numberOfSeats:req.body.noofSeats,
    fare:req.body.fare,
    boardingPoints:req.body.bpoints,
    droppingPoints:req.body.dpoints
})
bus.save()
.then(data=>{
    console.log(data)
    // res.send(data)
    resp.status(200).json({ message: "bus added"});
})
.catch((error) => {
  resp.status(400).json({ error: error, message: " error " });
});
});

// exports.create = async (req, res) => {
  // const busExists = await Bus.findOne({ busNumber: req.body.busNumber });
  // if (busExists)
  //   return res.status(403).json({
  //     error: "Bus is already added!"
  //   });

  // if (req.body.boardingPoints) {
  //   req.body.boardingPoints = req.body.boardingPoints.split(",");
  // }
 
  // if (req.body.droppingPoints) {
  //   req.body.droppingPoints = req.body.droppingPoints.split(",");
  // }
  
    // busSchema.create({name:req.query.name,type:req.query.type,
    //   busNumber:req.query.busNumber,
    //   fare: req.query.fare,
    //   features:req.query.features,
    //   description:req.query.description,
    //   seatsAvailable:req.query.seatsAvailable,
    //   numberOfSeats:req.query.numberOfSeats,
    //   departure_time:req.query.departure_time,
    //   isAvailable:req.query.isAvailable,
    //   startLocation: req.query.startLocation,
    //   locations:req.query.locations,
    //   travels:req.query.travels,
    //   travel:req.query.travel,
    //   endLocation:req.query.endLocation,
    //   journeyDate:req.query.journeyDate,
    //   boardingPoints:req.query.boardingPoints,
    //   droppingPoints:req.query.droppingPoints})
      
//   const bus = new busSchema({
//     name:req.body.name,
//     type:req.body.type,
//     busNumber:req.body.busNumber,
//     fare: req.body.fare,
//     features:req.body.features,
//     // description:req.body.description,
//     // seatsAvailable:req.body.seatsAvailable,
//     numberOfSeats:req.body.noofSeats,
//     departure_time:req.body.time,
//     isAvailable:req.body.isAvailable,
//     startLocation: req.body.sourcedrop,
//     // locations:req.body.locations,
//     travels:req.body.travels,
//     // travel:req.body.travel,
//     endLocation:req.body.destinationdrop,
//     journeyDate:req.body.date,
//     boardingPoints:req.body.bpoints,
//     droppingPoints:req.body.dpoints
//     // image: req.body.image
// })
// bus.save()
// .then(data=>{
//     console.log(data)
//     // res.send(data)
//     resp.status(200).json({ message: "Added Bus"});
// })
// .catch((error) => {
//   resp.status(400).json({ error: error, message: " error " });
// });
  

// });


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

app.post('/api/newroute',(req,res)=>{
  const nroute = new Nroute({
    source:req.body.source,
    destination:req.body.destination,
    type:req.body.type,
    time:req.body.time,
    fare:req.body.fare
  })
  nroute.save()
  .then(data=>{
      console.log(data)
      res.send(data)
      
  }).catch(err=>{
      console.log(err)
  })
  
})

app.post('/api/newbooking',(req,res)=>{
  const nbooking = new Nbooking({
    email:req.body.email,
    phone:req.body.phone,
    source:req.body.source,
    destination:req.body.destination,
    date:req.body.date,
    time:req.body.time,
    no:req.body.no,
    accomodation:req.body.accomodation,
    seatno:req.body.seatno,
    name:req.body.name,
    sex:req.body.sex,
    age:req.body.age
  })
  nbooking.save()
  .then(data=>{
      console.log(data)
      res.send(data)
  }).catch(err=>{
      console.log(err)
  })
  
})

router.get("/api/booking", async (req, resp) => {
  try{
    Nbooking.find({})
  .exec((err,booking)=>{
     if(err){
      req.json( {message : "No data found"});
      resp.redirect("/home");
     }else{
         resp.json(booking);
     }
  });
  }
  catch(error){
      return resp
      .status(400)
      .json({ error: err, message: "Error fetching data" });
  }
});

router.get("/api/routes", async (req, resp) => {
  try{
    Nroute.find({})
  .exec((err,routes)=>{
     if(err){
      req.json( {message : "No data found"});
      resp.redirect("/home");
     }else{
         resp.json(routes);
     }
  });
  }
  catch(error){
      return resp
      .status(400)
      .json({ error: err, message: "Error fetching data" });
  }
});


router.get("/api/schedule", async (req, resp) => {
  try{
    Nschedule.find({})
  .exec((err,schedule)=>{
     if(err){
      req.json( {message : "No data found"});
      resp.redirect("/home");
     }else{
         resp.json(schedule);
     }
  });
  }
  catch(error){
      return resp
      .status(400)
      .json({ error: err, message: "Error fetching data" });
  }
});

app.get("/api/cart", async (req, resp) => {
  try{
    Cart.find({})
  .exec((err,cart)=>{
     if(err){
      req.json( {message : "No data found"});
      resp.redirect("/home");
     }else{
         resp.json(cart);
     }
  });
  }
  catch(error){
      return resp
      .status(400)
      .json({ error: err, message: "Error fetching data" });
  }
});

app.post('api/newschedule',(req,res)=>{
  const nschedule = new Nschedule({
    routeid:req.body.routeid,
    source:req.body.source,
    destination:req.body.destination,
    type:req.body.type,
    starttime:req.body.starttime,
    endtime:req.body.endtime,
    stop:req.body.stop,
    time:req.body.time,
    fare:req.body.fare
  })
  nschedule.save()
  .then(data=>{
      console.log(data)
      res.send(data)
  }).catch(err=>{
      console.log(err)
  })
  
})

router.get("/api/location", async (req, resp) => {
  try{
    Nlocation.find({})
  .exec((err,location)=>{
     if(err){
      req.json( {message : "No data found"});
      resp.redirect("/home");
     }else{
         resp.json(location);
     }
  });
  }
  catch(error){
      return resp
      .status(400)
      .json({ error: err, message: "Error fetching data" });
  }
});

app.post('/api/addlocation',(req,resp)=>{
  const nlocation = new Nlocation({
    place:req.body.place,
    district:req.body.district
  })
  nlocation.save()
  .then(data=>{
      console.log(data)
      resp.send(data)
  }).catch(err=>{
      console.log(err)
  })
  
})

router.get("/api/userdata", async (req, resp) => {
  try{
    Login.find({_id:{$ne:"608116966644bc084c59f43b"}})
  .exec((err,usersdata)=>{
     if(err){
      req.json( {message : "No users found"});
      resp.redirect("/home");
     }else{
         resp.json(usersdata);
     }
  });
  }
  catch(error){
      return resp
      .status(400)
      .json({ error: err, message: "Error fetching data" });
  }
});


router.put("/api/profileActivate", async (req, resp) => {
  try {
      console.log(req.body)
      const query = { "email": req.body.email };
      // Set some fields in that document
      const update = {
        "$set": {
          "status":req.body.action
        }
      };
      // Return the updated document instead of the original document
      const options = { returnNewDocument: true };
      return Login.findOneAndUpdate(query, update, options)
        .then(updatedDocument => {
          if(updatedDocument) {
            resp.status(200).json({ message: `Successfullly ${req.body.action}`});

            console.log(`Successfully updated document: ${updatedDocument}.`)
            resp.redirect("/admin/users");
          } else {
            resp.status(200).json({ message: `Unsuccessfullly ${req.body.action}`});
            console.log("No user found")
          }
          return updatedDocument
        })
        .catch(err => console.error(`Failed to find and update document: ${err}`))
      
  } catch (error) {
    return resp
      .status(400)
      .json({ error: error, message: "Error updating" });
  }
});

router.post("/api/profileGet", async (req, resp) => {
  try{
  Login.findOne({email:req.body.email})
  .exec((err,userdata)=>{
     if(err){
      req.json( {message : "user not found",});
      resp.redirect("/");
     }else{
         resp.json(userdata);
     }
  });
  }
  catch(error){
      return resp
      .status(400)
      .json({ error: err, message: "Error fetching data" });
  }
});
router.put("/api/profileEdit", async (req, resp) => {
  try {
      console.log(req.body)
  if(req.body.password !== "")
  {
      salt = await bcrypt.genSalt(10);
      passvalue = await bcrypt.hash(req.body.password, salt);
  }
 else if(req.body.password ==="")
   {
       passvalue=req.body.hash;
    }

      const query = { "email": req.body.email };
      // Set some fields in that document
      const update = {
        "$set": {
          "name": req.body.name,
          "phone": req.body.phone,
          "password": passvalue,
          "city": req.body.city,          
        }
      };
      // Return the updated document instead of the original document
      const options = { returnNewDocument: true };
      return Login.findOneAndUpdate(query, update, options)
        .then(updatedDocument => {
          if(updatedDocument) {
            resp.status(200).json({ message: "profile updated"});

            console.log(`Successfully updated document: ${updatedDocument}.`)
          } else {
            resp.status(200).json({ message: "profile not updated"});
            console.log("No document matches the provided email.")
          }
          return updatedDocument
        })
        .catch(err => console.error(`Failed to find and update document: ${err}`))
      
  } catch (error) {
    return resp
      .status(400)
      .json({ error: error, message: "Error updating" });
  }
});

app.post('/api/feedback',(req,resp)=>{
  const nfeedback = new feedback({
    name:req.body.name,
    email:req.body.email,
    type:req.body.type,
    msg:req.body.msg
  })
  nfeedback.save()
  .then(data=>{
      console.log(data)
      resp.send(data)
  }).catch(err=>{
      console.log(err)
  })
  
});


// Serve the static files from the React app
// app.use(express.static(path.join(__dirname, 'client/build')));

// An api endpoint that returns a short list of items
app.get('/api/getList', (req,res) => {
    var list = ["item1", "item2", "item3"];
    res.json(list);
    console.log('Sent list of items');
});
router.get("/testApi", function(req, res, next) {
  res.send("API is working properly");
});

// Handles any requests that don't match the ones above
// app.get('*', (req,res) =>{
//     res.sendFile(path.join(__dirname+'/client/build/index.html'));
// });


