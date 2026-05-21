# Architecture

Memory Garden is a frontend-only React application.

## Frontend

The app lives in `src/` and uses React Router for public and protected routes. Authentication state is centralized in `AuthContext`, exposed through `useAuth`, and enforced with `ProtectedRoute`.

Main layers:

- `context/`: authentication provider and types
- `data/`: fake local data, including demo users and security state
- `components/`: shell UI, cards, auth garden panel, shadcn primitives
- `layouts/`: protected application shell
- `pages/`: public, auth, app, admin, profile, and settings screens
- `routes/`: route guards
- `models/`: TypeScript data models

## Fake Database

`src/data/mockAuth.ts` acts as the fake database for the course demo. It contains the seeded admin/user credentials in code and stores changes in `localStorage`.

The fake database tracks:

- users
- roles
- account status
- failed login count
- lockout time
- active browser session ids
- revoked session count
- saved preferences

## Data Flow

1. User signs in or signs up.
2. `mockAuth.ts` checks the local fake database.
3. A browser session id and sanitized user object are saved in `localStorage`.
4. `ProtectedRoute` uses auth context to permit or redirect users.
5. Memories are stored locally for the current browser and rendered in dashboard, garden, and timeline views.
6. Admin actions update account metadata in the local fake database.

## Important Limitation

This project intentionally has no backend. The security features are frontend demonstrations for Web 1. Real security must be enforced by a backend in a production/Web 2 application.
