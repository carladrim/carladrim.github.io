const express = require('express');
const path = require('path');
const mongoose = require('mongoose'); // Mongoose NoSQL 
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');

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

// Home Route
app.get('/', (req, res) => {
	res.render('index');
});

// Route Files
let profile = require('./routes/profile');
let user = require('./routes/user');
app.use('/profile', profile);
app.use('/user', user);

// Users List Route
app.get('/users', (req, res) => {
	User.find({}, (err, users) => {
		if(err){
			console.log(err);
		} else{
			res.render('users', {
				title: 'Users',
				users: users
			});
		}
	});
});

// Start server
app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});