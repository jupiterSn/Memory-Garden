import bcrypt from "bcryptjs";

import users from "../data/users.js";
import { invalidateUser } from "../services/securityService.js";
import { normalizeEmail, sanitizeUser } from "../utils/securityUtils.js";

export const updateProfile = (req, res) => {
  const user = users.find((candidate) => candidate.id === req.user.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const { name, email } = req.body;
  const normalizedEmail = normalizeEmail(email);

  if (!name || !normalizedEmail) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  const emailOwner = users.find(
    (candidate) => candidate.email === normalizedEmail && candidate.id !== user.id
  );

  if (emailOwner) {
    return res.status(400).json({ message: "Email is already used" });
  }

  user.name = name;

  if (user.email !== normalizedEmail) {
    user.email = normalizedEmail;
    user.emailVerified = false;
    user.emailVerifiedAt = null;
  }

  return res.json({ user: sanitizeUser(user) });
};

export const updatePassword = async (req, res) => {
  const user = users.find((candidate) => candidate.id === req.user.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword || newPassword.length < 8) {
    return res.status(400).json({
      message: "Current password and a new password of at least 8 characters are required",
    });
  }

  const passwordMatch = await bcrypt.compare(currentPassword, user.password);

  if (!passwordMatch) {
    return res.status(400).json({ message: "Current password is incorrect" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  invalidateUser(user.id);

  return res.json({ message: "Password updated. Please log in again." });
};

export const updatePreferences = (req, res) => {
  const user = users.find((candidate) => candidate.id === req.user.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.preferences = {
    ...user.preferences,
    ...req.body,
  };

  return res.json({
    preferences: user.preferences,
  });
};

export const exportAccount = (req, res) => {
  const user = users.find((candidate) => candidate.id === req.user.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json({
    user: sanitizeUser(user),
    preferences: user.preferences || {},
    exportedAt: new Date().toISOString(),
  });
};
