const express = require('express');
const router = express.Router();

// Bring in User Model
let User = require('../models/user');

// Resources Route
router.get('/', ensureAuthenticated, (req, res) => {
 res.render('resources', {
	  user: req.user
  });
});

// Add Favorite Process
router.post('/add', [

	check('title')
	.not()
	.isEmpty()
	.withMessage('Title is Required'),
	check('url')
	.not()
	.isEmpty()
	.withMessage('URL is Required')
	.custom((value, {req}) => {
		return new Promise((resolve, reject) => {
			let query = {_id: req.user.id};
			User.findOne(query, {favorites: {$elemMatch: {url: value}}}, (err, fav) => {
				if(err) reject(new Error(err));
				if(Boolean(fav)) reject(new Error('URL Already Exists.'));
				resolve(true);
			});
		});
	})

], (req, res) => {
	const title = req.body.title;
	const url = req.body.url;
	const description = req.body.description;
	const hashtags = req.body.hashtags.split(/\s+|\u0023+/);
	while(true){
		let index = hashtags.indexOf('');
		if(index === -1) break;
		tags.splice(index, 1);
	}

	let favorite = {};
	favorite.title = title;
	favorite.url = url;
	favorite.description = description;
	favorite.hashtags = hashtags;
	let query = {_id: req.user.id};
	User.updateOne(query, {$addToSet: {favorites: favorite}}, err => {
		if(err){
			console.log(err);
			return;
		} else {
			res.redirect('/resources');
		}
	});
});

// Access Control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  else res.redirect('/user/login');
}

module.exports = router;