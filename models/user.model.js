const mongoose = require("mongoose");
var userSchema = new mongoose.Schema({
	username: { type: String, required: true },
	password: { type: String, required: true },
	email: { type: String, required: true },
	phone: Number,
	address: String,
	role: { type: Number, default: 0 },
	avatar: String,
	wrongLoginCount: { type: Number, default: 0 },
	status: { type: Number, default: 1 },
	wallet: { type: Number, default: 0 },
});
var User = mongoose.model("User", userSchema);
module.exports = User;
