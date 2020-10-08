const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load Buyer module
const Buyer = require("../../models/Buyer");

// @route   POST api/users/register
// @desc    Registers a user
// @access   Public
router.post("/register", (req, res) => {
  console.log("Connected with backend REGISTER!", req.body);
  const { errors, isValid } = validateRegisterInput(req.body);

  //Check Validation
  if (!isValid) {
    console.log("Inside isvalid | REGISTER");
    // console.log("Invalid Errors | REGISTER: ", errors);
    return res.status(400).json(errors);
  }

  Buyer.findOne({ email: req.body.email })
    .then((buyer) => {
      if (buyer) {
        errors.email = "Email already exists";
        return res.status(400).json(errors);
      } else {
        const newBuyer = new Buyer({
          fname: req.body.fname,
          lname: req.body.lname,
          email: req.body.email,
          password: req.body.password,
          gender: req.body.gender,
        });
        // Encrypting Password to HASH
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newBuyer.password, salt, (err, hash) => {
            if (err) throw err;
            newBuyer.password = hash;
            newBuyer
              .save()
              .then((buyer) => {
                // res.json(buyer);
                const payload = {
                  id: buyer.id,
                  fname: buyer.fname,
                  lname: buyer.lname,
                  email: buyer.email,
                  gender: buyer.gender,
                }; //Create JWT payload
                console.log("Now bycrypting....");
                // Sign token
                jwt.sign(
                  payload,
                  keys.secretOrKey,
                  { expiresIn: 3600 },
                  (err, token) => {
                    console.log("Token Generated: ", token);
                    res.send({
                      success: true,
                      token: "Bearer " + token,
                      buyer,
                    });
                  }
                );
                // console.log("After token generation", payload.fname);
              })
              .catch((err) => console.log(err));
          });
        });
        // res.send(newBuyer);
        // res.send({ newBuyer, token: "Bearer " + token });
      }
    })
    .catch((err) => {
      console.log("Inside catch");
      console.log("error: ", err);
    });
});

// @route   POST api/users/login
// @desc    Login user
// @acess   Public
router.post("/login", (req, res) => {
  console.log("Connected with backend LOGIN!", req.body);
  const { errors, isValid } = validateLoginInput(req.body);

  //Check Validation
  if (!isValid) {
    console.log("INVALID LOGIN");
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  Buyer.findOne({ email }).then((buyer) => {
    // Check for buyer
    if (!buyer) {
      console.log("User not found!!");
      errors.email = "User not found";
      return res.status(404).json(errors);
    }
    // Check password
    bcrypt
      .compare(password, buyer.password)
      .then((isMatch) => {
        if (isMatch) {
          // User matched
          const payload = { id: buyer.id, fname: buyer.fname }; //Create JWT payload
          console.log("Found user now bycrypting....");
          // Sign token
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 3600 },
            (err, token) => {
              console.log("Token Generated");
              res.json({
                success: true,
                token: "Bearer " + token,
              });
            }
          );
        } else {
          console.log("Incorrect pwd");
          errors.password = "Incorrect Password";
          return res.status(400).json(errors);
        }
      })
      .catch((err) => {
        console.log("inside error");
        console.log(err);
      });
    // res.send(newBuyer);
  });
});

// @route   GET api/users/current
// @desc    Returns current user
// @acess   Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    });
  }
);

// router.get('/current', passport.authenticate('jwt', {session: false}),  (req, res) => {
//   res.json({
//     id: req.buyer.id,
//     name: req.buyer.name,
//     email: req.buyer.email
//   });
// });

module.exports = router;
