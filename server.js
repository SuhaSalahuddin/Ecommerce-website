const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");
const posts = require("./routes/api/posts");
const seller = require("./routes/api/seller");
const order = require("./routes/api/order");
const cookieParser = require("cookie-parser");

const app = express();

// Cookie middlewear
// app.use(cookieParser);

// Multer middlewear
app.use("/uploads", express.static("uploads"));

// Body parser middlewear
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
mongoose.set("useFindAndModify", false);

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Passport middlewear
app.use(passport.initialize());

// Passport Config
require("./config/passport.js")(passport);

// Use Routes
app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/api/seller", seller);
app.use("/api/order", order);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
