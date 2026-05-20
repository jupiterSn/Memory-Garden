import express from "express";

import {
  signup,
  login,
  verifyEmail,
  resendVerification,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.get("/verify-email/:token", verifyEmail);

router.post("/resend-verification", resendVerification);

router.get("/me", protect, (req, res) => {
  res.json({
    user: req.user,
    sessionId: req.sessionId,
  });
});

export default router;
