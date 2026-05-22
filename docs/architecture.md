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
- `lib/`: shared helpers for memory media normalization and search
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
- garden preferences

## Data Flow

1. User signs in or signs up.
2. `mockAuth.ts` checks the local fake database.
3. A browser session id and sanitized user object are saved in `localStorage`.
4. `ProtectedRoute` uses auth context to permit or redirect users.
5. Memories are stored locally by `AppRoutes` under a user-specific `memory-garden-memories-{userId}` key.
6. Memory edits flow from `MemoryDetailModal` back through `AppRoutes`, where the matching local memory is replaced and saved again.
7. Admin actions update account metadata in the local fake database.

## Memory Flow

Memory creation happens in `PlantMemory`. Attachments are converted to browser data URLs and saved in each memory's `mediaItems` array. The compatibility fields `mediaUrl` and `mediaType` are still populated for older memory shapes.

Memory editing happens in `MemoryDetailModal` from the dashboard, garden, and timeline. Users can update the title, story, date, and emotion while keeping the existing media attachments.

`getMemoryMedia` normalizes old and new memory media shapes before rendering. `filterMemories` powers the shared `?q=` search used by the navbar, dashboard, garden, and timeline.

## Project Scope

Memory Garden runs entirely in the browser for the course demo. Authentication state, preferences, admin metadata, and memories are all stored locally.
