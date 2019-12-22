const express = require('express');
const router = express.Router();

// @route   GET api/posts/test
// @desc    Test post route
// @acess   Public
router.get('/test', (req, res) => res.json({msg: "This is post test"}));

module.exports = router;