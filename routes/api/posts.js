const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// @route   GET api/posts/test
// @desc    Test post route
// @acess   Public
router.get('/test', (req, res) => res.json({msg: "This is post test"}));

module.exports = router;