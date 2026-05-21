# Memory Garden

Memory Garden is a frontend-only React application for preserving personal memories in a calm, visual garden experience. Users can sign up, sign in, plant memories with emotions, attach media, view their memories in a garden or timeline, and manage their account through a protected workspace.

The project uses a fake browser database instead of a real backend. Demo users are written directly in [mockAuth.ts](C:/web/Memory-Garden/src/data/mockAuth.ts), and app state is saved in `localStorage` so the Web 1 project stays frontend-only.

## Highlights

- React + TypeScript + Vite frontend
- Tailwind CSS, shadcn/ui primitives, lucide icons, Framer Motion
- Protected routing with Context API authentication
- Fake local authentication database in code
- Frontend security demonstrations: role checks, account status, lockout after failed logins, session ids, session revocation, password strength rules, and admin-only metadata
- Memory creation with images/videos, local persistence, garden rendering, and timeline views
- Separate memory storage per account in the fake browser database
- Dashboard with cards and AG Grid memory registry
- Profile, settings, and admin screens

## Demo Accounts

Admin:

```text
Email: admin@memorygarden.local
Password: Admin@12345
```

User:

```text
Email: user@memorygarden.local
Password: User@12345
```

Regular users can also be created from the signup screen.

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

## Running The Project

```bash
npm install
npm run dev
```

No backend server is required.

## Security Demo Notes

Because this is a frontend-only Web 1 project, these features are demonstrations, not production security:

- Login checks credentials from `src/data/mockAuth.ts`
- Protected routes redirect logged-out users
- Admin route requires `role: "admin"`
- Disabled users cannot log in
- Failed login attempts are counted
- Accounts lock for one minute after five failed attempts
- Signup and password change require a strong password
- Session ids are generated in the browser
- Admins can revoke sessions and change account status
- Admins can only see account metadata, not private memories
- Each account has its own memory list, dashboard, garden, and timeline data

For a real Web 2/backend project, password hashing, real rate limiting, database storage, secure cookies, server-side sessions, email verification, captcha, and two-factor authentication would belong on the backend.

## Documentation

Detailed documentation is available in [docs](./docs):

- [Architecture](./docs/architecture.md)
- [Frontend](./docs/frontend.md)
- [Admin Console](./docs/admin.md)
- [Presentation Guide](./docs/presentation-guide.md)

## Build Verification

```bash
npm.cmd run build
npm.cmd run lint
```
