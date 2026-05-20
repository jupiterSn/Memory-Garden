# Presentation Guide

## Project Summary

Memory Garden is a full-stack web application that lets users preserve memories as a visual garden. A user can create an account, log in, plant a memory with an emotion and optional media, then revisit those memories through a dashboard, garden, and timeline.

## Technologies Used

Frontend:

- React for component-based UI
- TypeScript for type safety
- Vite for fast development and optimized builds
- Tailwind CSS for styling
- shadcn/ui primitives for reusable UI foundations
- React Router DOM for routing
- Context API for authentication state
- Axios for API requests
- Framer Motion for animation
- AG Grid for dashboard table management
- Sonner for toast notifications

Backend:

- Node.js and Express for API routes
- JWT for authentication tokens
- bcrypt for password hashing
- dotenv for environment variables
- MySQL-ready architecture with current development stores

## Important Components

`AuthContext`:
Controls login, signup, logout, token, and current user.

`ProtectedRoute`:
Blocks protected pages if no authenticated user exists.

`MainLayout`:
Provides the authenticated app shell with sidebar and navbar.

`PlantMemory`:
Collects memory information and media, then creates a memory object.

`Garden`:
Renders memories as interactive plants on a realistic garden background.

`Dashboard`:
Shows memory statistics and an AG Grid table.

`Admin`:
Allows an admin to manage accounts and sessions without seeing private memories.

## Security Measures To Explain

Rate limiting:
Prevents repeated brute-force login attempts.

Captcha:
Cloudflare Turnstile can verify that the request is not automated.

Email confirmation:
New accounts are marked unverified until the user opens the verification link. Login is blocked until email ownership is confirmed.

Password hashing:
Passwords are stored as bcrypt hashes, never plaintext.

Pre-auth checks:
The backend checks account status before creating a session.

Anomaly detection:
Repeated failures or suspicious request patterns are recorded as security events.

Device trust:
The backend fingerprints devices and marks new/unusual devices.

2FA:
The backend has a two-factor check path that can be enabled per user.

Max sessions:
Users can only have a limited number of active sessions.

Token blacklist:
The backend can invalidate tokens before issue, by session, by user, or globally.

Admin privacy:
Admins can manage accounts but cannot read users' memories or uploaded media.

## Questions A Doctor Might Ask

Why use Context API?
It gives the whole app access to authentication state without passing props through every component.

Why use JWT?
JWTs let the backend issue a signed token that the frontend can send with protected requests.

Why use bcrypt?
bcrypt is designed for password hashing and includes salting and computational cost.

Why protected routes?
They prevent unauthenticated users from opening pages such as dashboard, garden, profile, and admin.

Why AG Grid?
It provides professional table features like sorting, filtering, pagination, and scalable data display.

Can admins see memories?
No. Admin endpoints return only account metadata and security status.

How would you make it production-ready?
Persist users, sessions, security events, and memories in MySQL; store media in object storage or a secure upload directory; configure Cloudflare Turnstile; use HTTPS; rotate JWT secrets; and add real TOTP/email 2FA.
