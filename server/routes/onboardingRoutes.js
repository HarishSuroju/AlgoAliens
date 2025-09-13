import express from "express";
import { saveOnboarding, getOnboardingStatus } from "../controllers/onboardingController.js";
// import authMiddleware from "../middleware/authMiddleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, saveOnboarding);
router.get("/", authMiddleware, getOnboardingStatus);
// router.get("/status", authMiddleware, getOnboardingStatus);

export default router;
