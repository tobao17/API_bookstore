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
const midToken = require("../middleware/verifiedToken.middleware");
//
//
//
//
//

router.get("/", midToken.verified, bookController.index);
router.get(
  "/getbook",
  midPaginate.paginateResult(book),
  bookController.getBook
);
router.post("/create", upload.single("books"), bookController.postCreate);
router.get("/delete/:id", bookController.delete);
router.post("/update", upload.single("books"), bookController.postUpdate);
router.post("/search", bookController.searchBooks);
module.exports = router;
