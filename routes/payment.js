const dotenv = require("dotenv").config();
const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require('crypto');

const cartTemplateCopy = require("../models/cart");
// const jerseyTemplatecopy = require("../models/CustomJerseyModel");

router.post("/orders", async (req, res) => {
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


router.post("/success", async (req, res) => {
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
                                            const query = { customerid:req.body.user,status:"cart"};
                                            const update = {
                                            "$set": {
                                                "status":"cashpayed",
                                                "payorderid":req.body.razorpayOrderId,
                                                "payementid":req.body.razorpayPaymentId,
                                                "shippingaddress":req.body.addressline,
                                                "pin":req.body.pin,
                                                
                                            }
                                            };
                                            const options = { returnNewDocument: true };
                                            return cartTemplateCopy.updateMany(query, update,options)
                                            .then(
                                                (updatedDocument2) => {
                                                if(updatedDocument2) {
                                                res.status(200).json({
                                                  msg: "succeffully payed",
                                                  orderId: req.body.razorpayOrderId,
                                                  paymentId: req.body.razorpayPaymentId,
                                                  user:req.body.receipt,
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

             if(req.body.payfrom==="jersey")
                         {
                                   try {  
                                              const query = {_id: req.body.reqid };
                                              // Set some fields in that document
                                              const update = {
                                                $set: {
                                                  payement:"paid",
                                                  shippingaddress:req.body.addressline,
                                                  pin:req.body.pin,
                                                },
                                              };
                                              // Return the updated document instead of the original document
                                              const options = { returnNewDocument: true };
                                              return jerseyTemplatecopy
                                                .findOneAndUpdate(query, update, options)
                                                .then((updatedDocument) => {
                                                  if (updatedDocument) {
                                                    res.status(200).json({
                                                      msg: "succeffully payed",
                                                      orderId: req.body.razorpayOrderId,
                                                      paymentId: req.body.razorpayPaymentId,
                                                      user:req.body.receipt,
                                                      payfrom:req.body.payfrom,
                                                    
                                                  });
                                                  } else {
                                                    res.status(200).json({ message: "payement canceled"});
                                                  }
                                                  return updatedDocument;
                                                })
                                                .catch((err) =>
                                                  console.error(`Failed to find and update document: ${err}`)
                                                );

                                              
                                        } catch (error) {
                                          return resp.status(400).json({ error: error, message: "Error updating" });
                                        }
                           }
      
    }else{
      return res.status(400).json({ msg: "Transaction not legit!" });
    }
    
    } catch (error) {
        res.status(500).send(error);
  }
});






router.post("/payed", async (req, resp) => {

  try {        
    console.log(req.body)
            const query = { customerid:req.body.user,status:"cart"};
            const update = {
              "$set": {
                "status":"cashpayed",
                "payorderid":req.body.razorpayOrderId,
                "payementid":req.body.razorpayPaymentId,
              }
            };
            const options = { returnNewDocument: true };
            return cartTemplateCopy.updateMany(query, update,options)
              .then(
                (updatedDocument2) => {
                if(updatedDocument2) {
                  resp.status(200).json({ message:"cart updated"});
                } else {
                  resp.status(200).json({ message: "cart not updated"});
                }
                return updatedDocument2
              });
            

  } catch (error) {
    return resp
      .status(400)
      .json({ error: error, message: "Error fetching data" });
  }
});

module.exports = router;
