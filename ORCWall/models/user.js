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
	photo_url:{
		type: String,
		default: "/resources/Images/user.png"
	},
	profession:{
		type: String,
		default: "\u200b"
	},
	biography:{
		type: String,
		default: "\u200b"
	},
	hashtags:{
		type: [String],
		required: false
	},
	favorites:{
		type: [{
			title: String,
			url: String,
			description: String,
			hashtags: [String]
		}],
		required: false
	}
});

const User = module.exports = mongoose.model('User', userSchema);