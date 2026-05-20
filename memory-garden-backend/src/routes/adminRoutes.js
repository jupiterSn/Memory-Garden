import express from "express";

import {
  getSecurityDashboard,
  createUser,
  deleteUser,
  listUsers,
  revokeSessions,
  updateUserStatus,
} from "../controllers/adminController.js";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, requireAdmin);

router.get("/users", listUsers);

router.post("/users", createUser);

router.patch("/users/:userId/status", updateUserStatus);

router.post("/users/:userId/revoke-sessions", revokeSessions);

router.delete("/users/:userId", deleteUser);

router.get("/security", getSecurityDashboard);

export default router;
