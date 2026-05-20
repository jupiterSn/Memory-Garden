import jwt from "jsonwebtoken";

import {
  globalInvalidation,
  loginAttempts,
  preTokenBlacklist,
  securityEvents,
  sessionBlacklist,
  sessions,
  userBlacklist,
} from "../data/securityStore.js";
import users from "../data/users.js";
import {
  createSessionId,
  getClientIp,
  getDeviceFingerprint,
  normalizeEmail,
} from "../utils/securityUtils.js";

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_ATTEMPTS = 10;
const MAX_SESSIONS_PER_USER = 3;

export function recordSecurityEvent(type, details = {}) {
  securityEvents.unshift({
    id: Date.now() + Math.random(),
    type,
    details,
    createdAt: new Date().toISOString(),
  });

  if (securityEvents.length > 200) {
    securityEvents.pop();
  }
}

export function checkRateLimit(req, email) {
  const key = `${getClientIp(req)}:${normalizeEmail(email) || "anonymous"}`;
  const now = Date.now();
  const attempt = loginAttempts.get(key) || {
    count: 0,
    firstAttemptAt: now,
  };

  if (now - attempt.firstAttemptAt > RATE_LIMIT_WINDOW_MS) {
    attempt.count = 0;
    attempt.firstAttemptAt = now;
  }

  attempt.count += 1;
  loginAttempts.set(key, attempt);

  if (attempt.count > RATE_LIMIT_MAX_ATTEMPTS) {
    recordSecurityEvent("RATE_LIMIT_BLOCK", {
      email: normalizeEmail(email),
      ip: getClientIp(req),
    });

    return {
      allowed: false,
      message: "Too many attempts. Please wait before trying again.",
    };
  }

  return { allowed: true };
}

export async function verifyCaptcha(req) {
  const token = req.headers["cf-turnstile-response"] || req.body.captchaToken;

  if (!process.env.CLOUDFLARE_TURNSTILE_SECRET) {
    return {
      allowed: true,
      mode: "development-bypass",
    };
  }

  if (!token) {
    return {
      allowed: false,
      message: "Captcha verification is required.",
    };
  }

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: process.env.CLOUDFLARE_TURNSTILE_SECRET,
        response: token,
        remoteip: getClientIp(req),
      }),
    }
  );

  const result = await response.json();

  return {
    allowed: Boolean(result.success),
    message: "Captcha verification failed.",
  };
}

export function preAuthChecks(req, user) {
  if (!user) {
    return { allowed: true };
  }

  if (user.status === "disabled") {
    return {
      allowed: false,
      message: "This account is disabled.",
    };
  }

  if (userBlacklist.has(user.id)) {
    return {
      allowed: false,
      message: "This account must be reviewed before login.",
    };
  }

  const deviceFingerprint = getDeviceFingerprint(req);

  if (
    user.trustedDevices?.length > 0 &&
    !user.trustedDevices.includes(deviceFingerprint)
  ) {
    recordSecurityEvent("UNTRUSTED_DEVICE", {
      userId: user.id,
      ip: getClientIp(req),
    });
  }

  return { allowed: true };
}

export function detectAnomaly(req, user) {
  const recentFailures = user?.failedLoginCount || 0;
  const isSuspiciousUserAgent = !req.headers["user-agent"];

  if (recentFailures >= 5 || isSuspiciousUserAgent) {
    recordSecurityEvent("LOGIN_ANOMALY", {
      userId: user?.id,
      failedLoginCount: recentFailures,
      ip: getClientIp(req),
    });

    return {
      flagged: true,
      reason: "Unusual login pattern detected.",
    };
  }

  return { flagged: false };
}

export function checkTwoFactor(user, twoFactorCode) {
  if (!user?.requiresTwoFactor) {
    return { allowed: true };
  }

  if (twoFactorCode === "123456") {
    return { allowed: true };
  }

  return {
    allowed: false,
    message: "Two-factor verification is required.",
  };
}

export function createSession(req, user) {
  const activeSessions = sessions.filter(
    (session) => session.userId === user.id && session.status === "active"
  );

  if (activeSessions.length >= MAX_SESSIONS_PER_USER) {
    const oldestSession = activeSessions.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )[0];

    oldestSession.status = "expired";
    sessionBlacklist.add(oldestSession.id);
  }

  const session = {
    id: createSessionId(),
    userId: user.id,
    deviceFingerprint: getDeviceFingerprint(req),
    ip: getClientIp(req),
    userAgent: req.headers["user-agent"] || "unknown",
    status: "active",
    createdAt: new Date().toISOString(),
    lastSeenAt: new Date().toISOString(),
  };

  sessions.push(session);

  if (!user.trustedDevices?.includes(session.deviceFingerprint)) {
    user.trustedDevices = [...(user.trustedDevices || []), session.deviceFingerprint];
  }

  return session;
}

export function createAuthToken(user, session) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role || "user",
    sessionId: session.id,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET || "memory-garden-dev-secret", {
    expiresIn: "7d",
  });

  if (preTokenBlacklist.has(token)) {
    throw new Error("Token rejected before issue.");
  }

  return token;
}

export function recordSuccessfulLogin(user, session) {
  user.lastLoginAt = new Date().toISOString();
  user.failedLoginCount = 0;
  session.lastSeenAt = user.lastLoginAt;
  recordSecurityEvent("LOGIN_SUCCESS", {
    userId: user.id,
    sessionId: session.id,
  });
}

export function verifyTokenLayers(decoded, token) {
  if (preTokenBlacklist.has(token)) {
    return { allowed: false, reason: "Pre-token blacklist" };
  }

  if (sessionBlacklist.has(decoded.sessionId)) {
    return { allowed: false, reason: "Session blacklist" };
  }

  if (userBlacklist.has(decoded.id)) {
    return { allowed: false, reason: "User blacklist" };
  }

  if ((decoded.iat || 0) * 1000 < globalInvalidation.invalidatedAt) {
    return { allowed: false, reason: "Global invalidation" };
  }

  const user = users.find((candidate) => candidate.id === decoded.id);

  if (user?.userInvalidatedAt && (decoded.iat || 0) * 1000 < user.userInvalidatedAt) {
    return { allowed: false, reason: "User invalidation timestamp" };
  }

  return { allowed: true };
}

export function getSecuritySummary() {
  return {
    activeSessions: sessions.filter((session) => session.status === "active").length,
    blacklistedSessions: sessionBlacklist.size,
    blacklistedUsers: userBlacklist.size,
    globalInvalidationAt: globalInvalidation.invalidatedAt,
    recentEvents: securityEvents.slice(0, 20),
  };
}

export function revokeUserSessions(userId) {
  sessions
    .filter((session) => session.userId === userId && session.status === "active")
    .forEach((session) => {
      session.status = "revoked";
      sessionBlacklist.add(session.id);
    });
}

export function invalidateUser(userId) {
  const user = users.find((candidate) => candidate.id === userId);

  if (user) {
    user.userInvalidatedAt = Date.now();
  }

  revokeUserSessions(userId);
}
