const express = require("express");
const router = express.Router();
const auth = require("../middleware/verifiedToken.middleware");
// const cartController = require("../controller/cart.controller");
const userController = require("../controller/user.controller");

router.post("/add", auth.verified, userController.addtoCart1);
//router.post("/add1", auth.verified, userController.addtoCart1);

// router.get("/", auth.verified, cartController.index);
// router.get("/delete/:id", auth.verified, cartController.deleteCart);

// router.get("/delete/:cartId/:productId", cartController.deleteBook);

module.exports = router;
