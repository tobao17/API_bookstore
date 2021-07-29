const express = require("express");
const router = express.Router();
const auth = require("../middleware/verifiedToken.middleware");
const orderController = require("../controller/order.controller");
router.post("/add", auth.verified, orderController.add); // all product =>  loai bo de test  // auth.verified
router.post("/addbyweb", auth.verified, orderController.addByWeb);
router.post("/update", orderController.update);
router.get("/myorder", auth.verified, orderController.checkOrder);
router.get("/cancel/:id", auth.verified, orderController.cancelOrder);
router.get("/", orderController.index);
router.get("/detail/:id", orderController.orderDetail);
router.get("/announce", orderController.announce);
router.post("/search", orderController.searchOrder);
router.get("/statistical", orderController.statistical);
module.exports = router;
