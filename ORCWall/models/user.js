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
	school:{
		type: String,
		default: "..."
	},
	workplace:{
		type: String,
		default: "..."
	},
	profession:{
		type: String,
		default: ""
	},
	biography:{
		type: String,
		default: "..."
	},
	picture_path:{
		type: String
	},
	hashtags:[{
		type: String
	}]
});

const User = module.exports = mongoose.model('User', userSchema);