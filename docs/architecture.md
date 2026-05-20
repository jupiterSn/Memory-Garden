# Architecture

Memory Garden is split into a React frontend and an Express backend.

## Frontend

The frontend lives in `src/` and uses React Router for public and protected routes. Authentication state is centralized in `AuthContext`, exposed through `useAuth`, and enforced with `ProtectedRoute`.

Main layers:

- `api/`: Axios client and token interceptor
- `context/`: authentication provider and types
- `components/`: shell UI, cards, auth garden panel, shadcn primitives
- `layouts/`: protected application shell
- `pages/`: public, auth, app, admin, profile, and settings screens
- `routes/`: route guards
- `models/`: TypeScript data models

## Backend

The backend lives in `memory-garden-backend/src/`.

Main layers:

- `server.js`: Express app composition
- `routes/`: HTTP route modules
- `controllers/`: request handling
- `middleware/`: authentication and authorization guards
- `services/`: reusable security/session logic
- `data/`: development stores
- `utils/`: sanitization and security helpers

## Data Flow

1. User signs in or signs up.
2. Backend verifies the request and creates a session.
3. Backend returns a JWT and sanitized user object.
4. Frontend stores token/user in `localStorage`.
5. Axios attaches the token to protected requests.
6. Protected routes use auth context to permit or redirect users.
7. Memories are stored locally for the current browser and rendered in dashboard, garden, and timeline views.
