const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const SellerSchema = new Schema({
  buyer: {
    type: Schema.Types.ObjectId,
    ref: "buyers",
  },
  userName: {
    type: String,
    required: true,
    max: 40,
  },
  cNIC: {
    type: Number,
    required: true,
    // max: 14,
  },
  phone: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  language: {
    //array of strings
    type: [String],
    required: true,
  },
  skills: {
    // array of strings
    type: [String],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  occupation: {
    // dropdown
    title: {
      type: String,
      // required: true
    },
    company: {
      type: String,
      // required: true
    },
    location: {
      type: String,
    },
    from: {
      type: Date,
      // required: true
    },
    to: {
      type: Date,
    },
    current: {
      type: Boolean,
      default: false,
    },
  },
  education: {
    school: {
      type: String,
      // required: true
    },
    degree: {
      type: String,
      // required: true
    },
    fieldofstudy: {
      type: String,
      // required: true
    },
    from: {
      type: Date,
      // required: true
    },
    to: {
      type: Date,
    },
    current: {
      type: Boolean,
      default: false,
    },
  },
  certificate: {
    institute: {
      type: String,
      // required: true
    },
    title: {
      type: String,
      // required: true
    },
    from: {
      type: Date,
      // required: true
    },
    to: {
      type: Date,
    },
    current: {
      type: Boolean,
      default: false,
    },
  },
  socials: {
    website: {
      type: String,
    },
    youtube: {
      type: String,
    },
    instagram: {
      type: String,
    },
    github: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    facebook: {
      type: String,
    },
    twitter: {
      type: String,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Seller = mongoose.model("seller", SellerSchema);
