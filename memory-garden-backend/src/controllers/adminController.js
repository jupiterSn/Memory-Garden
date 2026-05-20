import { sessions } from "../data/securityStore.js";
import users from "../data/users.js";
import {
  getSecuritySummary,
  invalidateUser,
  recordSecurityEvent,
  revokeUserSessions,
} from "../services/securityService.js";
import { sanitizeUserForAdmin } from "../utils/securityUtils.js";

export const listUsers = (req, res) => {
  const adminUsers = users.map((user) => {
    const activeSessions = sessions.filter(
      (session) => session.userId === user.id && session.status === "active"
    ).length;

    return sanitizeUserForAdmin({
      ...user,
      activeSessions,
    });
  });

  res.json({
    users: adminUsers,
  });
};

export const updateUserStatus = (req, res) => {
  const userId = Number(req.params.userId);
  const { status } = req.body;

  if (!["active", "disabled", "review"].includes(status)) {
    return res.status(400).json({
      message: "Invalid status",
    });
  }

  const user = users.find((candidate) => candidate.id === userId);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  if (user.role === "admin" && status === "disabled") {
    return res.status(400).json({
      message: "Admin account cannot be disabled from this panel",
    });
  }

  user.status = status;

  if (status !== "active") {
    revokeUserSessions(user.id);
  }

  recordSecurityEvent("ADMIN_USER_STATUS_UPDATE", {
    adminId: req.user.id,
    userId: user.id,
    status,
  });

  return res.json({
    user: sanitizeUserForAdmin(user),
  });
};

export const revokeSessions = (req, res) => {
  const userId = Number(req.params.userId);
  const user = users.find((candidate) => candidate.id === userId);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  invalidateUser(user.id);

  recordSecurityEvent("ADMIN_REVOKE_USER_SESSIONS", {
    adminId: req.user.id,
    userId: user.id,
  });

  return res.json({
    message: "User sessions revoked",
  });
};

export const getSecurityDashboard = (req, res) => {
  res.json(getSecuritySummary());
};
