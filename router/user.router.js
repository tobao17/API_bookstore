const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const auth = require("../middleware/verifiedToken.middleware");

const userController = require("../controller/user.controller");
router.get("/", userController.index);
router.get("/delete/:id", userController.delete);
router.post("/create", userController.create);
router.post("/login", userController.postLogin);
router.post("/forgetpassword", userController.forgetPassword);
router.post("/resetpassword", userController.resetPassword);
router.get("/userdetail/:id", userController.userDetail);
router.post("/signingg", userController.loggingg);
router.post("/signinfb", userController.logginFB);
router.post("/signinfb2", userController.logginFB2);
router.post(
	"/edituser",
	auth.verified,
	upload.single("images"),
	userController.edit
);

// router.get("/delete/:id", CategoriController.delete);
module.exports = router;
