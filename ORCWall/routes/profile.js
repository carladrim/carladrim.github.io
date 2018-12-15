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
	.withMessage('Last Name can\'t contain Numbers'),
	check('orcid')
	.not()
	.isEmpty()
	.withMessage('ORCID is Required')
	.matches(/\d{16}/)
	.withMessage('ORCID Must Contain Only Numbers')
	.isLength({min: 16}, {max: 16})
	.withMessage('ORCID Must Contain 16 Numbers')
	.custom((value, {req}) => {
		return new Promise((resolve, reject) => {
			User.findOne({orcid: value}, (err, user) => {
				if(err) reject(new Error(err));
				if(Boolean(user)){
					if(req.user.orcid !== value) reject(new Error('ORCID Already in Use'));
				}
				resolve(true);
			});
		});
	})

], (req, res) => {
	let user = {};
	user.first_name = req.body.first_name;
	user.last_name = req.body.last_name;
	user.orcid = req.body.orcid;
	user.biography = req.body.biography;

	console.log(user.orcid);

	const errors = validationResult(req);

	if(!errors.isEmpty()) {
		return res.render('profile', {
			user: req.user,
			errors: errors.array()
		});
	} else {

		/*Change profile picture code*/

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

// Change photos
router.post('/photos', parser.single("image"), (req, res) => {

	// Profile Picture URL saved in the database

	if(req.file === undefined){
		return res.redirect('/');
	}

	cloudinary.v2.uploader.upload(req.file.url, (error, result) => {
		User.updateOne({_id: req.user.id}, {photo_url: result.url}, {new: true}, (err, doc) => {
			if (err) {
				console.log(err);
				return;
			}
		});
		res.redirect('/profile');
	});
});

// Access Control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  else res.redirect('/user/login');
}

module.exports = router;