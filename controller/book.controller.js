const { title } = require("process");
const Book = require("../models/book.model");
//const transactions = require("../../model/transactions.model");

require("dotenv").config();
var cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});
module.exports.index = async (req, res) => {
  try {
    var books = await Book.find();
    return res.status(201).json(books);
  } catch (error) {
    return res.status(401).json("loi roi");
  }
};

module.exports.delete = async (req, res) => {
  try {
    await Book.deleteOne({ _id: req.params.id });
    return res.status(204).json("xoa thanh cong!");
  } catch (error) {
    res.status(403).json("xoa that bai");
  }
};
module.exports.postCreate = async (req, res) => {
  console.log(req.body);
  try {
    if (req.file) {
      await cloudinary.uploader.upload(req.file.path, (err, result) => {
        if (result) {
          req.body.images = result.url;
        }
        if (err) {
          console.log("loi o day");
          return res.status(403).json("them anh fail ");
        }
      });
    }

    await Book.create(req.body);
    return res.status(201).json("create success! ");
  } catch (error) {
    return res.status(401).json(`create fail ${error} !`);
  }
};

module.exports.postUpdate = async (req, res) => {
  if (req.file) {
    await cloudinary.uploader.upload(req.file.path, (err, result) => {
      if (result) {
        req.body.images = result.url;
      }
      if (err) {
        console.log("loi o day");
        return res.status(403).json("them anh fail ");
      }
    });
  }
  const {
    title,
    author,
    description,
    price,
    status,
    quantity,
    images,
  } = req.body;
  console.log();
  try {
    await Book.updateOne(
      { _id: req.body._id },
      {
        $set: {
          title,
          author,
          description,
          price,
          status,
          quantity,
          images,
        },
      }
    );
    return res.status(200).json("update success!");
  } catch (error) {
    return res.status(401).json("update fail!");
  }
};
module.exports.searchBooks = async (req, res) => {
  console.log(req.body.keyword);
  try {
    const bookSearch = await Book.find({
      title: { $regex: req.body.keyword, $options: "$i" },
    });
    res.status(200).json(bookSearch);
  } catch (error) {
    res.status(401).json(`search fail ${error}`);
  }
};
