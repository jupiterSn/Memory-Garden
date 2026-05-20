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
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#43383b">
      <h1 style="color:#be6077">Confirm your Memory Garden email</h1>
      <p>Welcome to Memory Garden. Please confirm your email before signing in.</p>
      <p>
        <a href="${verification.verificationUrl}" style="display:inline-block;background:#f9c6d7;color:#43383b;padding:12px 18px;border-radius:999px;text-decoration:none;font-weight:700">
          Confirm email
        </a>
      </p>
      <p>If the button does not work, open this link:</p>
      <p>${verification.verificationUrl}</p>
    </div>
  `;

  const message = {
    to: user.email,
    subject: "Confirm your Memory Garden email",
    html,
    text: `Welcome to Memory Garden. Confirm your email here: ${verification.verificationUrl}`,
    verificationUrl: verification.verificationUrl,
    createdAt: new Date().toISOString(),
  };

  emailOutbox.unshift(message);

  if (process.env.RESEND_API_KEY) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from:
          process.env.EMAIL_FROM ||
          "Memory Garden <onboarding@resend.dev>",
        to: [user.email],
        subject: message.subject,
        html: message.html,
        text: message.text,
        tags: [
          {
            name: "category",
            value: "email_verification",
          },
        ],
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      recordSecurityEvent("EMAIL_DELIVERY_FAILED", {
        userId: user.id,
        email: user.email,
        provider: "resend",
        status: response.status,
        error: result,
      });

      throw new Error("Email provider rejected the verification message.");
    }

    message.provider = "resend";
    message.providerId = result.id;
  } else if (process.env.EMAIL_WEBHOOK_URL) {
    const response = await fetch(process.env.EMAIL_WEBHOOK_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error("Email webhook rejected the verification message.");
    }

    message.provider = "webhook";
  } else if (process.env.NODE_ENV === "production") {
    throw new Error("Email delivery is not configured.");
  } else {
    message.provider = "development-outbox";
  }

  recordSecurityEvent("EMAIL_VERIFICATION_SENT", {
    userId: user.id,
    email: user.email,
    provider: message.provider,
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
