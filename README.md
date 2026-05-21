# Memory Garden

Memory Garden is a full-stack React and Node.js application for preserving personal memories in a calm, visual garden experience. Users can sign up, sign in, plant memories with emotions, attach media, view their memories in a garden or timeline, and manage their account through a protected workspace.

## Highlights

- React + TypeScript + Vite frontend
- Tailwind CSS, shadcn/ui primitives, lucide icons, Framer Motion
- Protected routing with Context API authentication
- Axios API client with JWT interceptor and 401 handling
- Memory creation with images/videos, local persistence, garden rendering, and timeline views
- Dashboard with cards and AG Grid memory registry
- Professional profile and settings surfaces
- Admin user console for account safety without access to private memories
- Express backend with JWT, bcrypt, security middleware, session tracking, and layered token invalidation
- Cloudflare Turnstile-ready captcha verification

## Demo Accounts

Admin:

```text
Email: admin@memorygarden.local
Password: Admin@12345
```

Regular users can be created from the signup screen.

## Frontend Routes

```text
/             Public landing page
/login        Login
/signup       Signup
/app          Protected garden home
/dashboard    Dashboard and AG Grid registry
/plant        Plant a memory
/garden       Visual planted garden
/timeline     Chronological memory view
/profile      Profile management
/settings     Workspace settings
/admin        Admin user safety console
```

## Backend Routes

```text
POST /api/auth/signup
POST /api/auth/login
GET  /api/auth/me

GET   /api/admin/users
PATCH /api/admin/users/:userId/status
POST  /api/admin/users/:userId/revoke-sessions
GET   /api/admin/security
```

Admin routes require an authenticated user with `role: "admin"`.

## Running The Project

Frontend:

```bash
npm install
npm run dev
```

Backend:

```bash
cd memory-garden-backend
npm install
npm run dev
```

The frontend expects the API at:

```text
http://localhost:5000/api
```

## Security Features

Memory Garden includes a layered authentication and session security design:

- Rate limiting for repeated login attempts
- Cloudflare Turnstile captcha verification hook
- User lookup before password comparison
- Pre-auth account status checks
- bcrypt password verification
- Login anomaly detection
- Device trust fingerprint checks
- Optional 2FA check flow
- Maximum active sessions per user
- Session creation and tracking
- Successful login recording
- Four token invalidation layers:
  - Pre-token blacklist
  - Session-level blacklist
  - User-level blacklist
  - Global invalidation timestamp

The current implementation uses in-memory development stores with clear service boundaries. These can be moved to MySQL tables without changing the route structure.

## Documentation

Detailed documentation is available in [docs](./docs):

- [Architecture](./docs/architecture.md)
- [Frontend](./docs/frontend.md)
- [Backend And Security](./docs/backend-security.md)
- [Admin Console](./docs/admin.md)
- [Presentation Guide](./docs/presentation-guide.md)

## Build Verification

```bash
npm.cmd run build
npm.cmd run lint
```

Backend syntax can be checked by starting the server:

```bash