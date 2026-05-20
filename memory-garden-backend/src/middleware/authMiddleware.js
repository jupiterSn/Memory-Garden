import jwt from "jsonwebtoken";

import users from "../data/users.js";
import { verifyTokenLayers } from "../services/securityService.js";
import { sanitizeUser } from "../utils/securityUtils.js";

export function protect(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "memory-garden-dev-secret"
    );

    const blacklistCheck = verifyTokenLayers(decoded, token);

    if (!blacklistCheck.allowed) {
      return res.status(401).json({
        message: "Session is no longer valid",
        reason: blacklistCheck.reason,
      });
    }

    const user = users.find((candidate) => candidate.id === decoded.id);

    if (!user || user.status === "disabled") {
      return res.status(401).json({
        message: "Account is not available",
      });
    }

    req.user = sanitizeUser(user);
    req.sessionId = decoded.sessionId;

    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required",
    });
  }

  return next();
}
