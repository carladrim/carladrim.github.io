const express = require('express');
const router = express.Router();

// Bring in User Model
let User = require('../models/user');

// Profile Route
router.get('/', (req, res) => {
	res.render('profile');
});

module.exports = router;