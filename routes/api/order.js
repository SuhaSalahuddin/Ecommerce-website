const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load input validation
// const validateRegisterInput = require("../../validation/register");
// const validateLoginInput = require("../../validation/login");

// Load Order module
const Order = require("../../models/Order");

// @route   GET api/order/test
// @desc    Test order route
// @acess   Public
router.get("/test", (req, res) => res.json({ msg: "This is order test" }));

module.exports = router;
