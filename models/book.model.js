const mongoose = require("mongoose");
var bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  description: String,
  price: Number,
  status: Number,
  quantity: Number,
  //seller: { type: mongoose.Schema.Types.ObjectId }, //, ref: "User"
  category: mongoose.Schema.Types.ObjectId,
  images: String,
});
var Book = mongoose.model("books", bookSchema);
module.exports = Book;
