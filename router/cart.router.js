const express = require("express");
const router = express.Router();
const auth = require("../middleware/verifiedToken.middleware");
// const cartController = require("../controller/cart.controller");
const userController = require("../controller/user.controller");

router.post("/add", auth.verified, userController.addtoCart);
router.post("/addfromlg", auth.verified, userController.addtoCart2);
//router.post("/add1", auth.verified, userController.addtoCart1);

// router.get("/", auth.verified, cartController.index);
router.get("/delete", auth.verified, userController.deleteCart);

router.get("/delete/:bookId", auth.verified, userController.deleteBook);

module.exports = router;
