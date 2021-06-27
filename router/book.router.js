const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const bookController = require("../controller/book.controller");

//
//
//
const book = require("../models/book.model");
const midPaginate = require("../middleware/paginate.middleware");
const Token = require("../middleware/verifiedToken.middleware");
const role = require("../middleware/role.validate");
//
//
//
//
//

router.get(
	"/",
	//Token.verified,
	bookController.index
);
router.get("/getbookCategory", bookController.categoryBook);
router.get("/getbookcategory/:id", bookController.getBookbycateId);
router.get("/getbook/:id", bookController.detail);
router.get(
	"/getbook",
	//Token.verified,
	midPaginate.paginateResult(book, "category"),
	bookController.getBook
);
router.post(
	"/create",
	//	Token.verified,
	// role.checkRole(role.ROLES.Seller),
	upload.single("images"),
	bookController.postCreate
);
router.get("/delete/:id", Token.verified, bookController.delete);
router.post(
	"/update",
	//	Token.verified,
	upload.single("images"),
	bookController.postUpdate
);
router.post("/search", bookController.searchBooks);
router.post("/filterbyprice", bookController.filterByPrice);
router.post("/filterbycategory", bookController.filterByCategory);
module.exports = router;
