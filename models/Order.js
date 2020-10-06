const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create schema
const OrderSchema = new Schema({
  buyerId: {
    type: Schema.Types.ObjectId,
    ref: "buyers",
  },
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: "seller",
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: "post",
  },
  price: {
    type: String,
    required: true,
  },
  Status: {
    buyerOrderStatus: {
      type: String,
    },
    sellerOrderStatus: {
      type: String,
    },
    orderStatus: {
      type: String,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Order = mongoose.model("order", OrderSchema);
