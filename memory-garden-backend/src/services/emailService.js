import crypto from "crypto";

import { emailOutbox, emailVerificationTokens } from "../data/securityStore.js";
import { recordSecurityEvent } from "./securityService.js";

const EMAIL_TOKEN_TTL_MS = 60 * 60 * 1000;

export function createEmailVerification(user) {
  const token = crypto.randomUUID();
  const expiresAt = Date.now() + EMAIL_TOKEN_TTL_MS;
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const verificationUrl = `${baseUrl}/verify-email/${token}`;

  emailVerificationTokens.set(token, {
    token,
    userId: user.id,
    email: user.email,
    expiresAt,
    usedAt: null,
  });

  return {
    token,
    verificationUrl,
    expiresAt,
  };
}

export async function sendVerificationEmail(user, verification) {
  const message = {
    to: user.email,
    subject: "Confirm your Memory Garden email",
    body: `Welcome to Memory Garden. Confirm your email here: ${verification.verificationUrl}`,
    verificationUrl: verification.verificationUrl,
    createdAt: new Date().toISOString(),
  };

  emailOutbox.unshift(message);

  if (process.env.EMAIL_WEBHOOK_URL) {
    await fetch(process.env.EMAIL_WEBHOOK_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(message),
    });
  }

  recordSecurityEvent("EMAIL_VERIFICATION_SENT", {
    userId: user.id,
    email: user.email,
  });

  return message;
}

export function verifyEmailToken(token, users) {
  const record = emailVerificationTokens.get(token);

  if (!record || record.usedAt) {
    return {
      verified: false,
      message: "Verification link is invalid.",
    };
  }

  if (Date.now() > record.expiresAt) {
    return {
      verified: false,
      message: "Verification link has expired.",
    };
  }

  const user = users.find((candidate) => candidate.id === record.userId);

  if (!user) {
    return {
      verified: false,
      message: "Account was not found.",
    };
  }

  user.emailVerified = true;
  user.emailVerifiedAt = new Date().toISOString();
  record.usedAt = Date.now();

  recordSecurityEvent("EMAIL_VERIFIED", {
    userId: user.id,
  });

  return {
    verified: true,
    user,
  };
}
