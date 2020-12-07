const express = require("express");
const router = express.Router();
const auth = require("../middleware/verifiedToken.middleware");
const orderController = require("../controller/order.controller");
router.post("/add", auth.verified, orderController.add);
router.get("/delete/:id", auth.verified, orderController.deleteOrder);

router.get("/myorder", auth.verified, orderController.checkorder);
router.get("/", auth.verified, orderController.index);
module.exports = router;
