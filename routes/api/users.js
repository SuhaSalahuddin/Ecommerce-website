const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Load Buyer module
const Buyer = require("../../models/Buyer");

// @route   POST api/users/register
// @desc    Registers a user
// @access   Public
router.post("/register", (req, res) => {
  const {errors, isValid} = validateRegisterInput(req.body);

  //Check Validation
  if (!isValid){
    return res.status(400).json(errors);
  }

  Buyer.findOne({ email: req.body.email })
    .then(buyer => {
      if (buyer) {
        errors.email = 'Email already exists';
        return res.status(400).json(errors);
      } else {
        const newBuyer = new Buyer({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });
        // Encrypting Password to HASH
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newBuyer.password, salt, (err, hash) => {
            if (err) throw err;
            newBuyer.password = hash;
            newBuyer
              .save()
              .then(buyer => res.json(buyer))
              .catch(err => console.log(err));
          });
        });
        res.send(newBuyer);
      }
    })
    .catch(err => {
      console.log("Inside catch");
      console.log("error: ", err);
    });
});

// @route   POST api/users/login
// @desc    Login user
// @acess   Public
router.post("/login", (req, res) => {
  const {errors, isValid} = validateLoginInput(req.body);

  //Check Validation
  if (!isValid){
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  Buyer.findOne({ email }).then(buyer => {
    // Check for buyer
    if (!buyer) {
      errors.email = 'User not found';
      return res.status(404).json(errors);
    }
    // Check password
    bcrypt.compare(password, buyer.password).then(isMatch => {
      if (isMatch) {
        // User matched
        const payload = { id: buyer.id, name: buyer.name }; //Create JWT payload

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        errors.password = 'Incorrect Password';
        return res.status(400).json(errors);
      }
    });
    // .catch(err => console.log(err));
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
      email: req.user.email
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
