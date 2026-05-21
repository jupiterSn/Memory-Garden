# Memory Garden

Memory Garden is a frontend-only React application for preserving personal memories in a calm, visual garden experience. Users can sign up, sign in, plant memories with emotions, attach media, search their archive, view memories in a garden or timeline, and manage their account through a protected workspace.

## Highlights

- React + TypeScript + Vite frontend
- Tailwind CSS, shadcn/ui primitives, lucide icons, Framer Motion
- Protected routing with Context API authentication
- Frontend mock authentication and browser `localStorage` persistence
- Memory creation with images/videos, per-account local persistence, garden rendering, and timeline views
- Shared memory search through the `?q=` URL query on dashboard, garden, and timeline pages
- Dashboard with summary cards, recent memory previews, and a clickable memory registry
- Professional profile and settings surfaces
- Admin user console for account safety without access to private memories
- Frontend security demonstrations: strong passwords, lockout, session tracking, session revocation, and account status controls

## Demo Accounts

Admin:

```text
Email: admin@memorygarden.local
Password: Admin@12345
```

Demo user:

```text
Email: user@memorygarden.local
Password: User@12345
```

Regular users can be created from the signup screen.

## Frontend Routes

```text
/             Public landing page
/login        Login
/signup       Signup
/app          Protected garden home
/dashboard    Dashboard, summary cards, and memory registry
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

Open the Vite URL printed by the terminal, usually `http://localhost:5173`.

## Security Features

Memory Garden includes frontend demonstrations of authentication and session security:

- Pre-auth account status checks
- Strong password requirements
- Failed-login counter
- One-minute lockout after five failed attempts
- Browser session id generation and tracking
- Password changes that revoke active sessions
- Admin session revocation
- Admin account status controls
- Admin metadata privacy: admins cannot read private memories or media

The current implementation uses browser `localStorage` through `src/data/mockAuth.ts` and user-specific memory keys in `src/routes/AppRoutes.tsx`. These features are for a frontend/Web 1 demo. Production security requires a backend.

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
