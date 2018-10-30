const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const saltRounds = 10;

// Bring in User Model
let User = require('../models/user');

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
						res.redirect('/user/interests');
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
router.post('/login',
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/user/login'
	})
);

// Interests Form
router.get('/interests', (req, res) => {
	res.render('interests');
});

// Interests Process
router.post('/interests', (req, res) => {
	const tags = req.body.tags.split(/\s+|\u0023+/);
	while(true){
		let index = tags.indexOf('');
		if(index === -1) break;
		tags.splice(index, 1);
	}
	res.redirect('/');
});

module.exports = router;