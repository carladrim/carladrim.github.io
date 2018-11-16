const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const multer = require('multer');
const cloudinary = require('cloudinary');
const cloudinaryStorage = require("multer-storage-cloudinary");

// Bring in User Model
let User = require('../models/user');

// Cloudinary Config
const storage = cloudinaryStorage({
	cloudinary: cloudinary,
	folder: "demo",
	allowedFormats: ["jpg", "png"],
	transformation: [{width: 500, height: 500, crop: "limit"}]
});
const parser = multer({storage: storage});

// Profile Route
router.get('/', ensureAuthenticated, (req, res) => {
 console.log(req.user.profession);
 res.render('profile', {
	  user: req.user
  });
});

// Profile Edit Process
router.post('/edit', [

	check('email', 'Email is Required').not().isEmpty(),
	check('email', 'Email is not Valid').isEmail(),
	check('first_name', 'First Name is Required').not().isEmpty(),
	check('first_name', 'First Name can\'t contain Numbers').not().matches(/\d/),
	check('last_name', 'Last Name is Required').not().isEmpty(),
	check('last_name', 'Last Name can\'t contain Numbers').not().matches(/\d/)

], (req, res) => {
	let user = {};
	user.email = req.body.email;
	user.first_name = req.body.first_name;
	user.last_name = req.body.last_name;
	user.school = req.body.school;
	user.workplace = req.body.workplace;
	user.profession = req.body.profession;
	user.biography = req.body.biography;

	const errors = validationResult(req);

	if(!errors.isEmpty()) {
		for (let obj of errors.array())
			console.log(obj.msg);
		res.render('profile', {
			user: req.user,
			errors: errors
		});
	} else {

		let query = {_id: req.user.id};

		User.updateOne(query, user, err => {
			console.log();
			if(err){
				console.log(err);
				return;
			} else {
				res.redirect('/profile');
			}
		});
	}
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