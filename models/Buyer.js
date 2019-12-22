const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create schema
const BuyerSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

module.exports = Buyer = mongoose.model("buyers", BuyerSchema);
