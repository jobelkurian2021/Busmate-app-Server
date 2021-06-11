const express = require("express");
const router = express.Router();
const {v4 : uuidv4} = require('uuid')

const billTemplatecopy = require("../models/Bill");
// const productTemplatecopy = require("../models/ProductModel");

//  ADD TO BILL

router.post("/billAdd", async (req, resp) => {    
    const billid = uuidv4()
    try{  
       billTemplatecopy.findOne({productId:req.body.productid,userid:req.body.userid,status:0})
          .exec((err,billdata)=>{
            if(err){
              resp.json( {message : "bill error "});
            }else{
              if(billdata)
              {
                resp.json( {message : "product alreday addded"});
              }
                if(!billdata)
                    // add to categorey
             {
                  const Billinstance = new billTemplatecopy({
                     productId: req.body.productid,
                     userid:req.body.userid,
                     Totalprice:req.body.price,
                     billid:billid
                  });
                  console.log(req.body);
                  Billinstance
                    .save()
                    .then((data) => {

                    
                      const query1 = { "_id":req.body.productid};
                      const update1 = {
                        "$inc": {
                          "quantity":-1
                        }
                      };
                      console.log(query1)
                      const options = { returnNewDocument: true };
                      return productTemplatecopy.findOneAndUpdate(query1, update1, options)
                        .then((productdata,err) => {
                  
                            if(err) resp.json({ message: "server error" });
                            if(!productdata)  resp.json({ message: "no products" });
                            if(productdata){
                              resp.status(200).json({ message:"bill added",DATA:data});
                            }
                        });



                    })
                    .catch((error) => {
                      resp.status(400).json({ error: error, message: " error " });
                    });
               }      
            }
          });
      
      }
      catch(error){
          return resp
          .status(400)
          .json({ error: error, message: "Error fetching data" });
      }
      
     
    });

// Get data

router.post("/billGet", async (req, resp) => {
  try{
    billTemplatecopy.find({userid:req.body.userid,status:0}).populate('productId')
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

router.get("/historey", async (req, resp) => {
  try{
    billTemplatecopy.find({userid:req.query.userid,status:1}).populate('productId')
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

router.put("/plusquantity", async (req, resp) => {
  try {
      console.log(req.body)
      const newtotal=req.body.unitprice;
      console.log(newtotal)
      const query1 = { "_id":req.body.productid};
      // Set some fields in that document
      const update1 = {
        "$inc": {
          "quantity":-1
        }
      };
      // Return the updated document instead of the original document
      const options = { returnNewDocument: true };
      return productTemplatecopy.findOneAndUpdate(query1, update1, options)
        .then(updatedDocument1 => {
          if(updatedDocument1) {
            // resp.status(200).json({ message: "subcategorey updated"});

                        
                          const query = { "billid":req.body.billid};
                          // Set some fields in that document
                          const update = {
                            "$inc": {
                              "Totalprice":+newtotal,
                              "noofitems":+1
                            }
                          };
                          // Return the updated document instead of the original document
                          const options = { returnNewDocument: true };
                          return billTemplatecopy.findOneAndUpdate(query, update, options)
                            .then(updatedDocument2 => {
                              if(updatedDocument2) {
                                resp.status(200).json({ message:"Total updated"});
                    
                                console.log(`Successfully updated document: ${updatedDocument2}.`)
                              } else {
                                resp.status(200).json({ message: "Total not updated"});
                                console.log("Total not updated")
                              }
                              return updatedDocument2
                            })
                            .catch(err => console.error(`Failed to find and update document: ${err}`))

                   
            // console.log(`Successfully updated document: ${updatedDocument}.`)
          } else {
            resp.status(200).json({ message: "Total not updated"});
            console.log("Total not valid.")
          }
        })
        .catch(err => console.error(`Failed to find and update document: ${err}`))
      
  } catch (error) {
    return resp
      .status(400)
      .json({ error: error, message: "Error updating" });
  }
}); 


router.put("/minusquantity", async (req, resp) => {
  try {
      console.log(req.body)
      const newtotal=req.body.unitprice;
      console.log(newtotal)
      const query1 = { "_id":req.body.productid};
      // Set some fields in that document
      const update1 = {
        "$inc": {
          "quantity":+1
        }
      };
      // Return the updated document instead of the original document
      const options = { returnNewDocument: true };
      return productTemplatecopy.findOneAndUpdate(query1, update1, options)
        .then(updatedDocument1 => {
          if(updatedDocument1) {
            // resp.status(200).json({ message: "subcategorey updated"});

                        
                          const query = { "billid":req.body.billid};
                          // Set some fields in that document
                          const update = {
                            "$inc": {
                              "Totalprice":-newtotal,
                              "noofitems":-1
                            }
                          };
                          // Return the updated document instead of the original document
                          const options = { returnNewDocument: true };
                          return billTemplatecopy.findOneAndUpdate(query, update, options)
                            .then(updatedDocument2 => {
                              if(updatedDocument2) {
                                resp.status(200).json({ message:"Total updated"});
                    
                                console.log(`Successfully updated document: ${updatedDocument2}.`)
                              } else {
                                resp.status(200).json({ message: "Total not updated"});
                                console.log("Total not valid.")
                              }
                              return updatedDocument2
                            })
                            .catch(err => console.error(`Failed to find and update document: ${err}`))

                   
            // console.log(`Successfully updated document: ${updatedDocument}.`)
          } else {
            resp.status(200).json({ message: "Total not updated"});
            console.log("Total not valid.")
          }
        })
        .catch(err => console.error(`Failed to find and update document: ${err}`))
      
  } catch (error) {
    return resp
      .status(400)
      .json({ error: error, message: "Error updating" });
  }
}); 

router.post("/total", async (req, resp) => {
  try {
    billTemplatecopy.find({ userid:req.body.userid,status:0 })
    .exec((err, requestaddata) => {
        if (err) {
          resp.json({ message:"server error" });
        }
        if(!requestaddata)
        {
          resp.json({ message:"cart is empty" });
        }
        if(requestaddata.length!==0)
        {
          let val =0;
          let sum= requestaddata.map(item=>{return val=item.Totalprice});
          let result=sum.reduce((a, b) => a + b);
          resp.json(result);
     }});
  } catch (error) {
    return resp
      .status(400)
      .json({ error: err, message: "Error fetching data" });
  }
});

router.post("/billitemDelete",async (req,resp) => {
try{
  billTemplatecopy.findOneAndDelete({"billid":req.body.billid},(err)=>{
    if(err)
    {
      resp.json( {message : "server error"});
    }else{
      const query1 = { "productid":req.body.productid};
      const update1 = {
        "$inc": {
          "quantity":+req.body.quantity
        }
      };
      const options = { returnNewDocument: true };
      return productTemplatecopy.findOneAndUpdate(query1, update1, options)
        .then((productdata,err) => {
  
            if(err) resp.json({ message: "server error" });
            if(!productdata)  resp.json({ message: "no products" });
            if(productdata){
              resp.json( {message : "deleted"});
            }
        });
    }
  }
  )
}catch (error) {
    return resp
      .status(400)
      .json({ error: error, message: "Error updating" });
  }
});

router.put("/billsubmit",async (req,resp) => {
  try {
    console.log(req.body)
    const filter = {userid:req.body.userid,status:0};
    // Set some fields in that document
    const update = {
      "$set": {
        "status":1
      }
    };
    // Return the updated document instead of the original document
    const options = { returnNewDocument: true };
    return billTemplatecopy.updateMany(filter, update, options)
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
  


module.exports = router;