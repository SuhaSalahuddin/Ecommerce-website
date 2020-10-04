const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create schema
const BuyerSchema = new Schema({
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    possibleValues: ["male", "female", "other"],
  },
});

module.exports = Buyer = mongoose.model("buyers", BuyerSchema);
