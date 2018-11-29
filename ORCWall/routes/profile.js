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
 res.render('profile', {
	  user: req.user
  });
});

// Profile Edit Process
router.post('/edit', [

	check('email')
	.not()
	.isEmpty()
	.withMessage('Email is Required')
	.isEmail()
	.withMessage('Email is not Valid')
	.custom((value, {req}) => {
		return new Promise((resolve, reject) => {
			User.findOne({email: req.body.email}, (err, user) => {
				if(err) reject(new Error(err))
				if(Boolean(user)) reject(new Error('E-mail Already in Use'))
				resolve(true);
			});
		});
	}),
	check('first_name')
	.not()
	.isEmpty()
	.withMessage('First Name is Required')
	.not()
	.matches(/\d/)
	.withMessage('First Name can\'t contain Numbers'),
	check('last_name')
	.not()
	.isEmpty()
	.withMessage('Last Name is Required')
	.not()
	.matches(/\d/)
	.withMessage('Last Name can\'t contain Numbers')

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