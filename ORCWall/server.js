const express = require('express');
const path = require('path');
const mongoose = require('mongoose'); // Mongoose NoSQL
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const Twitter = require('twitter');
const multer = require('multer');
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const config = require('./config/database');
const axios = require('axios');

const port = 3000;

// DB Connect - Mongoose NoSQL
mongoose.connect(config.database, {useNewUrlParser: true});
let db = mongoose.connection;

// Check connection
db.once('open', () => {
	console.log('Connected to MongoDB');
});

// Check for DB errors - Mongoose NoSQL
db.on('error', err => {
	console.log(err);
});

// Init App
const app = express();

// Bring in Models
let User = require('./models/user');

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Cloudinary Config
require('./config/cloudinary');

// Twitter Client Config
let Client = require('./config/twitter');

app.get('*', (req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Home Route
app.get('/', ensureAuthenticated, (req, res) => {
	let tags = req.user.hashtags;
	let redditp;

	console.log(tags);

	if(tags.length == 0) tags[0] = "test";

	for (i in tags){
		axios.get('https://www.reddit.com/r/'+tags[0]+'/new.json')
			.then(function (response) {
				redditp = response.data.data.children;
			})
			.catch(function (error) {
				res.redirect('/');
			});
	}

	for (i in tags) tags[i] = '"'+tags[i]+'"';
	let query = tags.toString().replace(/,/g, ' OR ');
	Client.get('search/tweets', {q: query, count: 50 }, (error, tweets, response) => {
		let tweet = tweets.statuses;
		if(tweet === undefined) tweet = [];
		if(redditp === undefined) redditp = [];
		res.render('index', {
			user: req.user,
			tweets: tweet,
			reddits: redditp
		});
	});
});

// Route Files
let profile = require('./routes/profile');
let user = require('./routes/user');
app.use('/profile', profile);
app.use('/user', user);

// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()) return next();
  else res.redirect('/user/login');
}

// Start server
app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});
