const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const multer = require('multer');
const cloudinary = require('cloudinary');
const cloudinaryStorage = require("multer-storage-cloudinary");

const saltRounds = 10;

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

// Register Form
router.get('/register', (req, res) => {
	res.render('register');
});

// Register Process
router.post('/register', [

	check('email', 'Email is Required').not().isEmpty(),
	check('email', 'Email is not Valid').isEmail(),
	check('password', 'Password is Required').not().isEmpty(),
	check('password', 'Password Must Contain 5 Characters').isLength({ min: 5 }),
	check('password', 'Password Must Contain an Uppercase Letter').matches(/[A-Z]/),
	check('password', 'Password Must Contain a Number').matches(/\d/),
	check('r_password', 'Passwords do not Match').custom((value, { req }) => {
		return value === req.body.password;
	}),
	check('first_name', 'First Name is Required').not().isEmpty(),
	check('first_name', 'First Name can\'t contain Numbers').not().matches(/\d/),
	check('last_name', 'Last Name is Required').not().isEmpty(),
	check('last_name', 'Last Name can\'t contain Numbers').not().matches(/\d/)

], (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	const r_password = req.body.r_password;
	const first_name = req.body.first_name;
	const last_name = req.body.last_name;

	const errors = validationResult(req);

	if(!errors.isEmpty()) {
		for (let obj of errors.array())
			console.log(obj.msg);
		res.render('register', {
			errors: errors
		});
	} else {
		let newUser = new User({
			email: email,
			password: password,
			first_name: first_name,
			last_name: last_name
		});

		bcrypt.genSalt(saltRounds, (err, salt) => {
			bcrypt.hash(newUser.password, salt, (err, hash) => {
				if(err) {
					console.log(err);
				}
				newUser.password = hash;
				newUser.save(err => {
					if(err) {
						console.log(err);
						return;
					} else {
						passport.authenticate('local', {
							successRedirect: '/user/interests',
							failureRedirect: '/user/login'
						})(req, res);
					}
				});
			});
		});
	}
});

// Login Form
router.get('/login', (req, res) => {
	res.render('login');
});

// Login Process
router.post('/login', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/user/login'
	})(req, res, next);
});

// Interests Form
router.get('/interests', (req, res) => {
	res.render('interests');
});

// Interests Process
router.post('/interests', parser.single("image"), (req, res) => {
	if(req.file === undefined){
		res.render('interests');
		return;
	}
	let image = {};
	image.url = req.file.url;
	image.id = req.file.public_id;
	cloudinary.v2.uploader.upload(image.url, (error, result) => {
		User.findOneAndUpdate({email: req.user.email}, {$set:{photo_url: result.url}}, {new: true}, (err, doc) => {
			if (err) {
				console.log(err);
				return;
			}
		});
		res.redirect('/');
	});
});

// Logout
router.get('/logout', ensureAuthenticated, (req, res) =>{
	req.logout();
	res.redirect('/user/login');
});

// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()) return next();
  else res.redirect('/user/login');
}

module.exports = router;