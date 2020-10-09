const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const PostSchema = new Schema({
  seller: {
    type: Schema.Types.ObjectId,
    ref: "seller",
  },
  // title
  name:{
    type: String,
    required: true,
  },
  tagline:{
    type: String
  },
  price: {
    type: Number,
    // required: true,
  },
  category:{
    type: String,
    possibleValues: ["baking", "stitching", "development", "arts"]
  },
  description: {
    type: String,
    required: true,
  },
  postImage: [
    {
      type: String,
      // required: true,
    },
  ],
  rates: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "buyers",
      },
      star: {
        type: Number,
        // required: true
      },
    },
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "buyers",
      },
      text: {
        type: String,
        required: true,
      },
      name: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Post = mongoose.model("post", PostSchema);
