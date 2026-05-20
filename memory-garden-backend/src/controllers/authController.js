import bcrypt from "bcryptjs";

import users from "../data/users.js";
import {
  createEmailVerification,
  sendVerificationEmail,
  verifyEmailToken,
} from "../services/emailService.js";
import {
  checkRateLimit,
  checkTwoFactor,
  createAuthToken,
  createSession,
  detectAnomaly,
  preAuthChecks,
  recordSecurityEvent,
  recordSuccessfulLogin,
  verifyCaptcha,
} from "../services/securityService.js";
import { normalizeEmail, sanitizeUser } from "../utils/securityUtils.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!name || !normalizedEmail || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    const captcha = await verifyCaptcha(req);

    if (!captcha.allowed) {
      return res.status(403).json({
        message: captcha.message,
      });
    }

    const existingUser = users.find(
      (user) => user.email === normalizedEmail
    );

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now(),
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: "user",
      status: "active",
      createdAt: new Date().toISOString(),
      lastLoginAt: null,
      emailVerified: false,
      emailVerifiedAt: null,
      trustedDevices: [],
      userInvalidatedAt: 0,
      failedLoginCount: 0,
      requiresTwoFactor: false,
    };

    users.push(newUser);

    const verification = createEmailVerification(newUser);
    await sendVerificationEmail(newUser, verification);

    res.status(201).json({
      user: sanitizeUser(newUser),
      emailVerificationRequired: true,
      verificationUrl: verification.verificationUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Signup failed",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, twoFactorCode } = req.body;
    const normalizedEmail = normalizeEmail(email);

    const rateLimit = checkRateLimit(req, normalizedEmail);

    if (!rateLimit.allowed) {
      return res.status(429).json({
        message: rateLimit.message,
      });
    }

    const captcha = await verifyCaptcha(req);

    if (!captcha.allowed) {
      return res.status(403).json({
        message: captcha.message,
      });
    }

    const user = users.find(
      (candidate) => candidate.email === normalizedEmail
    );

    const preAuth = preAuthChecks(req, user);

    if (!preAuth.allowed) {
      return res.status(403).json({
        message: preAuth.message,
      });
    }

    if (!user) {
      recordSecurityEvent("USER_LOOKUP_MISS", {
        email: normalizedEmail,
      });

      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      user.failedLoginCount = (user.failedLoginCount || 0) + 1;
      detectAnomaly(req, user);

      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    if (!user.emailVerified) {
      const verification = createEmailVerification(user);
      await sendVerificationEmail(user, verification);

      return res.status(403).json({
        message: "Please confirm your email before logging in.",
        emailVerificationRequired: true,
        verificationUrl: verification.verificationUrl,
      });
    }

    const twoFactor = checkTwoFactor(user, twoFactorCode);

    if (!twoFactor.allowed) {
      return res.status(403).json({
        message: twoFactor.message,
        twoFactorRequired: true,
      });
    }

    const anomaly = detectAnomaly(req, user);
    const session = createSession(req, user);
    const token = createAuthToken(user, session);

    recordSuccessfulLogin(user, session);

    res.json({
      token,
      user: sanitizeUser(user),
      session: {
        id: session.id,
        createdAt: session.createdAt,
        trusted: !anomaly.flagged,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Login failed",
    });
  }
};

export const verifyEmail = (req, res) => {
  const result = verifyEmailToken(req.params.token, users);

  if (!result.verified) {
    return res.status(400).json({
      message: result.message,
    });
  }

  return res.json({
    message: "Email verified",
    user: sanitizeUser(result.user),
  });
};

export const resendVerification = async (req, res) => {
  const normalizedEmail = normalizeEmail(req.body.email);
  const user = users.find((candidate) => candidate.email === normalizedEmail);

  if (!user) {
    return res.status(200).json({
      message: "If the account exists, a verification email was sent.",
    });
  }

  if (user.emailVerified) {
    return res.json({
      message: "Email is already verified.",
    });
  }

  const verification = createEmailVerification(user);
  await sendVerificationEmail(user, verification);

  return res.json({
    message: "Verification email sent.",
    verificationUrl: verification.verificationUrl,
  });
};
