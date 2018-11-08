const express = require('express');
const router = express.Router();

// Bring in User Model
let User = require('../models/user');

// Profile Route
router.get('/', ensureAuthenticated, (req, res) => {
	res.render('profile');
});

// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()) return next();
  else res.redirect('/user/login');
}

module.exports = router;