import express from "express";
import { register, login, verifyOtp } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getMe } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOtp);
router.get("/me", authMiddleware, getMe);

export default router;
