import crypto from "crypto";

export function normalizeEmail(email = "") {
  return String(email).trim().toLowerCase();
}

export function getClientIp(req) {
  return (
    req.headers["cf-connecting-ip"] ||
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket.remoteAddress ||
    "unknown"
  );
}

export function getDeviceFingerprint(req) {
  const source = [
    req.headers["user-agent"] || "unknown-agent",
    req.headers["accept-language"] || "unknown-language",
    getClientIp(req),
  ].join("|");

  return crypto.createHash("sha256").update(source).digest("hex");
}

export function createSessionId() {
  return crypto.randomUUID();
}

export function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role || "user",
    status: user.status || "active",
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,
  };
}

export function sanitizeUserForAdmin(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role || "user",
    status: user.status || "active",
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,
    activeSessions: user.activeSessions || 0,
    failedLoginCount: user.failedLoginCount || 0,
  };
}
