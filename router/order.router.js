const express = require("express");
const router = express.Router();
const auth = require("../middleware/verifiedToken.middleware");
const orderController = require("../controller/order.controller");
router.post("/add", orderController.add);
router.get("/delete/:id", orderController.deleteOrder);

module.exports = router;
