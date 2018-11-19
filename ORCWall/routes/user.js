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
	check('password')
	.not()
	.isEmpty()
	.withMessage('Password is Required')
	.isLength({ min: 5 })
	.withMessage('Password Must Contain 5 Characters')
	.matches(/[A-Z]/)
	.withMessage('Password Must Contain an Uppercase Letter')
	.matches(/\d/)
	.withMessage('Password Must Contain a Number'),
	check('r_password', 'Passwords do not Match')
	.custom((value, { req }) => { return value === req.body.password; }),
	check('first_name', 'First Name is Required')
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

	// Hashtags saved in the database
	const tags = req.body.tags.split(/\s+|\u0023+/);
	while(true){
		let index = tags.indexOf('');
		if(index === -1) break;
		tags.splice(index, 1);
	}
	let user = {};
	user.hashtags = tags;
	let query = {_id: req.user.id};
	User.updateOne(query, user, err => {
		if(err){
			console.log(err);
			return;
		}
	});

	// Profile Picture URL saved in the database
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