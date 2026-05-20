import express from "express";

import {
  exportAccount,
  updatePassword,
  updatePreferences,
  updateProfile,
} from "../controllers/accountController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.patch("/profile", updateProfile);

router.patch("/password", updatePassword);

router.patch("/preferences", updatePreferences);

router.get("/export", exportAccount);

export default router;
