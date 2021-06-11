const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  id:{
    type: String
  },
  place: {
    type: String,
    // trim: true,
    required: true,
    maxlength: 32
  },
  district: {
    type: String,
    // trim: true,
    required: true,
    maxlength: 32
  }
});

module.exports = mongoose.model("Location", locationSchema);
