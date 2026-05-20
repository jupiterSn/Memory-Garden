# Backend And Security Documentation

## Authentication Stack

The backend uses:

- Express
- JWT
- bcryptjs
- security middleware
- in-memory development stores

Passwords are never stored as plaintext. They are hashed with bcrypt before saving.

## Login Security Flow

1. Normalize email.
2. Apply rate limiting.
3. Verify Cloudflare Turnstile captcha when configured.
4. Look up user.
5. Run pre-auth account checks.
6. Compare password with bcrypt.
7. Confirm the email is verified.
8. Detect anomalies such as repeated failures.
9. Check optional two-factor code.
10. Enforce max active session limit.
11. Create session.
12. Sign JWT with session ID.
13. Record successful login.

## Rate Limiting

The login endpoint tracks attempts by IP and email. Too many attempts in the window are blocked with HTTP `429`.

## Cloudflare Turnstile

The backend supports Turnstile through `CLOUDFLARE_TURNSTILE_SECRET`. In development, if the secret is missing, verification is bypassed so local testing can continue.

## Email Confirmation

Signup creates an unverified account and an email verification token. The user must confirm the token through `/verify-email/:token` before login is allowed. In development, the backend returns the verification URL and stores a message in an in-memory outbox. In production, configure an email delivery provider through `EMAIL_WEBHOOK_URL` or replace the email service with SMTP/provider-specific delivery.

## Device Trust

The backend creates a device fingerprint from user agent, language, and IP. Trusted devices are remembered per user in the development store.

## Two-Factor Authentication

The service supports a `requiresTwoFactor` flag. If enabled, login requires a two-factor code. The development demo accepts `123456`; production should replace this with TOTP or email/SMS verification.

## Max Sessions

Each user is limited to three active sessions. When a fourth session is created, the oldest active session is expired and blacklisted.

## Token Blacklist Layers

Memory Garden uses four invalidation layers:

- Pre-token blacklist: rejects a token before it can be trusted.
- Session-level blacklist: revokes a specific session.
- User-level blacklist: blocks an entire account.
- Global invalidation timestamp: invalidates every token issued before a global time.

There is also a per-user invalidation timestamp used when revoking all sessions for one user.

## Admin Privacy Boundary

Admins can manage users and sessions, but admin endpoints return only account metadata. They do not return memory descriptions, media, or private garden contents.
