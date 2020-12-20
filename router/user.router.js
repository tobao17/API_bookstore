const express = require("express");
const router = express.Router();

const userController = require("../controller/user.controller");
router.get("/", userController.index);
router.post("/create", userController.create);
router.post("/login", userController.postLogin);
router.get("/userdetail/:id", userController.userDetail);
// router.get("/delete/:id", CategoriController.delete);
module.exports = router;
