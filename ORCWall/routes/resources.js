const express = require('express');
const router = express.Router();

// Resources Route
router.get('/', ensureAuthenticated, (req, res) => {
 res.render('resources', {
	  user: req.user
  });
});

// Access Control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  else res.redirect('/user/login');
}

module.exports = router;