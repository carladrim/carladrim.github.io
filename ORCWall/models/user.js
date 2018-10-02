const mongoose = require('mongoose');

// User schema
let userSchema = mongoose.Schema({
	email:{
		type: String,
		required: true
	},
	password:{
		type: String,
		required: true
	},
	first_name:{
		type: String,
		required: true
	},
	last_name:{
		type: String,
		required: true
	},
	orcid:{
		type: Number,
		required: false
	}
});

const User = module.exports = mongoose.model('User', userSchema);