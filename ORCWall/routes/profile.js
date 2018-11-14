const express = require('express');
const router = express.Router();

// Bring in User Model
let User = require('../models/user');

// Profile Route
router.get('/', ensureAuthenticated, (req, res) => {
  res.render('profile', {
  	first_name: req.user.first_name,
  	last_name: req.user.last_name
  });
});

// Resources Route
router.get('/resources', (req, res) => {
  res.render('resources');
});

// Access Control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  else res.redirect('/user/login');
}

module.exports = router;