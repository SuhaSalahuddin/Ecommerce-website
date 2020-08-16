const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const PostSchema = new Schema({
  seller: {
    type: Schema.Types.ObjectId,
    ref: "seller",
  },
  text: {
    type: String,
    required: true,
  },
  postImage: [
    {
      type: String,
      // required: true,
    },
  ],
  name: {
    type: String,
  },
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
