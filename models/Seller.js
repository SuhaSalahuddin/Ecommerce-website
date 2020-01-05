const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const SellerSchema = new Schema ({
  buyer: {
    type: Schema.Types.ObjectId,
    ref: "buyers"
  },
  userName: {
    type: String,
    required: true,
    max: 40
  },
  description:{
    type: String,
    required: true
  },
  language:{ //array of strings
    type: [String],
    required: true
  },
  occupation:{ // dropdown    
    title:{
      type: String,
      // required: true
    },
    company:{
      type: String,
      // required: true
    },
    location:{
      type: String
    },
    from:{
      type: Date,
      // required: true
    },
    to:{
      type: Date
    },
    current:{
      type: Boolean,
      default: false
    }
  },
  skills:{ // array of strings
    type: [String],
    required: true
  },
  education:{
    school:{
      type: String,
      // required: true
    },
    degree:{
      type: String,
      // required: true
    },
    fieldofstudy:{
      type: String,
      // required: true
    },
    from:{
      type: Date,
      // required: true
    },
    to:{
      type: Date
    },
    current:{
      type: Boolean,
      default: false
    }
  },
  certificate:{
    institute:{
      type: String,
      // required: true
    },
    title:{
      type: String,
      // required: true
    },
    from:{
      type: Date,
      // required: true
    },
    to:{
      type: Date
    },
    current:{
      type: Boolean,
      default: false
    }
  },
  website:{
    type: String
  },
  socials:{
    youtube:{
      type: String
    },
    instagram:{
      type: String
    },
    github:{
      type: String
    },
    linkedin:{
      type: String
    },
    facebook:{
      type: String
    },
    twitter:{
      type: String
    }
  },
  phone:{
    type: String,
    required: true
  },
  location:{
    type: String,
    required: true
  },
  date:{
    type: Date,
    default: Date.now
  }
});

module.exports = Seller = mongoose.model("seller", SellerSchema);