const mongoose = require("mongoose");
var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  phone: Number,
  address: String,
  role: Number,
  avatar: String,
  name: String,
  status: { type: Number, default: 1 },
  wallet: { type: Number, default: 0 },
});
var User = mongoose.model("User", userSchema);
module.exports = User;
