import express from "express";

import {
  getSecurityDashboard,
  listUsers,
  revokeSessions,
  updateUserStatus,
} from "../controllers/adminController.js";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, requireAdmin);

router.get("/users", listUsers);

router.patch("/users/:userId/status", updateUserStatus);

router.post("/users/:userId/revoke-sessions", revokeSessions);

router.get("/security", getSecurityDashboard);

export default router;
