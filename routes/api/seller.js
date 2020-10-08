const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport"); //protected route
const jwt_decode = require("jwt-decode");

// Load validation
const validateSellerInput = require("../../validation/seller");

// Load models
const Seller = require("../../models/Seller");
const Buyer = require("../../models/Buyer");

// @route   GET api/seller/test
// @desc    Test seller route
// @acess   Public
router.get("/test", (req, res) => res.json({ msg: "This is seller test" }));

// @route   GET api/seller
// @desc    Get current seller
// @acess   Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //Protected route
    const errors = {};
    Seller.findOne({ buyer: req.user.id })
      .populate("buyer", ["name", "email"])
      .then((seller) => {
        if (!seller) {
          errors.noseller = "There is no buyer with this username";
          return res.status(404).json(errors);
        }
        res.json(seller);
      })
      .catch((err) => res.status(404).json(err));
  }
);

// @route   GET api/seller/all
// @desc    Get all profiles of seller
// @acess   Public
router.get("/all", (req, res) => {
  const errors = {};

  Seller.find()
    .populate("buyer", ["name", "email"])
    .then((sellers) => {
      if (!sellers) {
        errors.noseller = "There are no sellers";
        return res.status(404).json(errors);
      }
      res.json(sellers);
    })
    .catch((err) => res.status(404).json(err));
});

// @route   GET api/seller/userName/:userName
// @desc    Get profile of seller by their username
// @acess   Public
router.get("/userName/:userName", (req, res) => {
  const errors = {};

  Seller.findOne({ userName: req.params.userName })
    .populate("buyer", ["name", "email"])
    .then((seller) => {
      if (!seller) {
        errors.noseller = "This buyer is not a seller";
        res.status(404).json(errors);
      }
      res.json(seller);
    })
    .catch((err) => res.status(404).json({ seller: "This are no sellers" }));
});

// @route   GET api/seller/user/:user_id
// @desc    Get profile of seller by their id
// @acess   Public
// router.get("/user/:user_id", (req, res) => {
router.get("/user/:user_id", (req, res) => {
  const errors = {};

  Seller.findOne({ buyer: req.params.user_id })
    .populate("buyer", ["name", "email"])
    .then((seller) => {
      if (!seller) {
        errors.noseller = "This buyer is not a seller";
        res.status(404).json(errors);
      }
      res.json(seller);
    })
    .catch((err) =>
      res.status(404).json({ seller: "This buyer is not a seller" })
    );
});

// @route   POST api/seller
// @desc    Create or Edit seller
// @acess   Private
router.post(
  "/",
  // passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const token = req.body.headers["Authorization"];
    console.log("Token: ", token);
    const decodedToken = jwt_decode(token);
    console.log("Decoded Token: ", decodedToken.id);
    const id = decodedToken.id;

    // console.log("Request.Body: ", req.body);
    const { errors, isValid } = validateSellerInput(req.body);

    // Check validation
    if (!isValid) {
      console.log("INVALID SELLER!!!!");
      return res.status(400).json(errors);
    }

    // get fields
    const sellerFields = {};
    sellerFields.buyer = id;
    if (req.body.userName) sellerFields.userName = req.body.userName;
    if (req.body.cNIC) sellerFields.cNIC = req.body.cNIC;
    if (req.body.phone) sellerFields.phone = req.body.phone;
    if (req.body.location) sellerFields.location = req.body.location;
    if (req.body.age) sellerFields.age = req.body.age;
    if (req.body.description) sellerFields.description = req.body.description;
    if (req.body.date) sellerFields.date = req.body.date;

    //Split into array | language & skills
    if (typeof req.body.language !== "undefined") {
      sellerFields.language = req.body.language.split(",");
    }
    if (typeof req.body.skills !== "undefined") {
      sellerFields.skills = req.body.skills.split(",");
    }

    // Nested / embedded objects | occupation, education, certificate, socials
    sellerFields.occupation = {};
    if (req.body.title) sellerFields.occupation.title = req.body.title;
    if (req.body.company) sellerFields.occupation.company = req.body.company;
    if (req.body.location) sellerFields.occupation.location = req.body.location;
    if (req.body.from) sellerFields.occupation.from = req.body.from;
    if (req.body.to) sellerFields.occupation.to = req.body.to;
    if (req.body.current) sellerFields.occupation.current = req.body.current;

    sellerFields.education = {};
    if (req.body.school) sellerFields.education.school = req.body.school;
    if (req.body.degree) sellerFields.education.degree = req.body.degree;
    if (req.body.fieldofstudy)
      sellerFields.education.fieldofstudy = req.body.fieldofstudy;
    if (req.body.from) sellerFields.education.from = req.body.from;
    if (req.body.to) sellerFields.education.to = req.body.to;
    if (req.body.current) sellerFields.education.current = req.body.current;

    sellerFields.certificate = {};
    if (req.body.institute)
      sellerFields.certificate.institute = req.body.institute;
    if (req.body.title) sellerFields.certificate.title = req.body.title;
    if (req.body.to) sellerFields.certificate.to = req.body.to;
    if (req.body.from) sellerFields.certificate.from = req.body.from;
    if (req.body.current) sellerFields.certificate.current = req.body.current;

    sellerFields.socials = {};
    if (req.body.website) sellerFields.socials.website = req.body.website;
    if (req.body.youtube) sellerFields.socials.youtube = req.body.youtube;
    if (req.body.instagram) sellerFields.socials.instagram = req.body.instagram;
    if (req.body.github) sellerFields.socials.github = req.body.github;
    if (req.body.linkedin) sellerFields.socials.linkedin = req.body.linkedin;
    if (req.body.facebook) sellerFields.socials.facebook = req.body.facebook;
    if (req.body.twitter) sellerFields.socials.twitter = req.body.twitter;

    Seller.findOne({ buyer: id }).then((seller) => {
      if (seller) {
        // Update
        Seller.findOneAndUpdate(
          { buyer: id },
          { $set: sellerFields },
          { new: true }
        )
          .then((seller) => res.json(seller))
          .catch((error) => {
            throw error;
          });
      }
      // Create
      else {
        // Check if username exists
        Seller.findOne({ userName: sellerFields.userName }).then((seller) => {
          if (seller) {
            errors.userName = "This username already exists";
            res.status(400).json(errors);
          }
          // Save Seller
          new Seller(sellerFields).save().then((seller) => res.json(seller));
        });
      }
    });
  }
);

module.exports = router;
