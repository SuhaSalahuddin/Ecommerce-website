const express = require('express');
const router = express.Router();

// @route   GET api/profile/test
// @desc    Test profile route
// @acess   Public
router.get('/test', (req, res) => res.json({msg: "This is profile test"}));

module.exports = router;