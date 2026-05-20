import bcrypt from "bcryptjs";

import { sessions } from "../data/securityStore.js";
import users from "../data/users.js";
import {
  getSecuritySummary,
  invalidateUser,
  recordSecurityEvent,
  revokeUserSessions,
} from "../services/securityService.js";
import { normalizeEmail, sanitizeUserForAdmin } from "../utils/securityUtils.js";

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

export const createUser = async (req, res) => {
  const { name, email, password, role = "user" } = req.body;
  const normalizedEmail = normalizeEmail(email);

  if (!name || !normalizedEmail || !password || password.length < 8) {
    return res.status(400).json({
      message: "Name, email, and a password of at least 8 characters are required",
    });
  }

  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const existingUser = users.find((candidate) => candidate.email === normalizedEmail);

  if (existingUser) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const user = {
    id: Date.now(),
    name,
    email: normalizedEmail,
    password: await bcrypt.hash(password, 10),
    role,
    status: "active",
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
    emailVerified: true,
    emailVerifiedAt: new Date().toISOString(),
    trustedDevices: [],
    userInvalidatedAt: 0,
    failedLoginCount: 0,
    requiresTwoFactor: false,
    preferences: {},
  };

  users.push(user);

  recordSecurityEvent("ADMIN_CREATE_USER", {
    adminId: req.user.id,
    userId: user.id,
  });

  return res.status(201).json({ user: sanitizeUserForAdmin(user) });
};

export const deleteUser = (req, res) => {
  const userId = Number(req.params.userId);
  const userIndex = users.findIndex((candidate) => candidate.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  const user = users[userIndex];

  if (user.role === "admin") {
    return res.status(400).json({
      message: "Admin account cannot be deleted from this panel",
    });
  }

  revokeUserSessions(user.id);
  users.splice(userIndex, 1);

  recordSecurityEvent("ADMIN_DELETE_USER", {
    adminId: req.user.id,
    userId,
  });

  return res.json({ message: "User deleted" });
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
