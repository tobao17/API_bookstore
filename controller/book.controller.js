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
		var books = await Book.find().populate("category", "-_id");
		return res.status(201).json(books);
	} catch (error) {
		return res.status(404).json(`fail ${error}`);
	}
};

module.exports.getBook = async (req, res) => {
	res.json(res.paginateResult);
};

module.exports.delete = async (req, res) => {
	try {
		await Book.deleteOne({ _id: req.params.id });
		return res.status(201).json("delete success!");
	} catch (error) {
		res.status(400).json("delete fail!");
	}
};
module.exports.detail = async (req, res) => {
	try {
		const book = await Book.findOne({ _id: req.params.id }).populate(
			"category",
			"-_id"
		);
		return res.status(200).json(book);
	} catch (error) {
		res.status(400).json("fail cc!");
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
					return res.status(403).json("create image fail ");
				}
			});
		}

		await Book.create(req.body);
		return res.status(201).json("create success! ");
	} catch (error) {
		return res.status(404).json(`create fail ${error} !`);
	}
};

module.exports.postUpdate = async (req, res) => {
	if (req.file) {
		await cloudinary.uploader.upload(req.file.path, (err, result) => {
			if (result) {
				req.body.images = result.url;
			}
			if (err) {
				return res.status(404).json(`create fail ${error} !`);
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
		return res.status(200).json(`update success!`);
	} catch (error) {
		return res.status(404).json(`update fail!`);
	}
};
module.exports.searchBooks = async (req, res) => {
	console.log(req.body.keyword);
	try {
		const bookSearch = await Book.find({
			title: { $regex: req.body.keyword, $options: "$i" },
		});
		return res.status(200).json(bookSearch);
		//
	} catch (error) {
		return res.status(404).json(`search fail ${error}`);
	}
};
