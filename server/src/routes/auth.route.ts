import express from "express";
import { jwtCheck } from "../middleware/auth.middleware.js";
import authController from "../controllers/auth.controller.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/check-auth", jwtCheck, authController.checkAuth);

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.post("/logout", authController.logout);

router.put(
	"/update-profile",
	jwtCheck,
	upload.single("profileImage"),
	authController.updateProfile
);

router.post("/verify-email", jwtCheck, authController.verifyEmail);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);

export default router;
