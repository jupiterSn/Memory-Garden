# Presentation Guide

## Project Summary

Memory Garden is a frontend-only web application that lets users preserve memories as a visual garden. A user can create an account, log in, plant a memory with an emotion and optional images/videos, then revisit those memories through a dashboard, garden, and timeline.

The project intentionally does not use a real backend. It uses a fake database in the frontend because this is a Web 1/frontend course project.

## Technologies Used

- React for component-based UI
- TypeScript for type safety
- Vite for fast development and optimized builds
- Tailwind CSS for styling
- shadcn/ui primitives for reusable UI foundations
- React Router DOM for routing
- Context API for authentication state
- Framer Motion for animation
- Sonner for toast notifications
- `localStorage` for fake persistence in the browser

## Fake Database

The fake database is in `src/data/mockAuth.ts`.

It includes demo credentials written in code:

```text
Admin: admin@memorygarden.local / Admin@12345
User: user@memorygarden.local / User@12345
```

The app saves any new users, sessions, profile changes, and admin changes in `localStorage`.

Each account also gets its own memory storage key, so a new user starts with a fresh empty dashboard, garden, and timeline.

After signup, the user is redirected to the login page and must sign in with the new credentials.

## Important Components

`AuthContext`:
Controls login, signup, logout, session id, and current user.

`mockAuth.ts`:
Acts like a fake database and contains the frontend-only security demo logic.

`ProtectedRoute`:
Blocks protected pages if no authenticated user exists.

`MainLayout`:
Provides the authenticated app shell with sidebar and navbar.

`PlantMemory`:
Collects memory information and one or more media files, then creates a memory object.

`Garden`:
Renders memories as interactive plants on a realistic garden background.

`Dashboard`:
Shows a visual welcome hero, memory statistics, recent memories, and a clickable registry.

`memorySearch.ts`:
Filters memories by title, description, emotion, date, and media name. The navbar, dashboard, garden, and timeline share the same `?q=` query.

`MemoryDetailModal`:
Opens a full memory view from the dashboard, garden, or timeline, including every media attachment.

`Admin`:
Allows an admin to manage account metadata and sessions without seeing private memories.

## Security Measures To Explain

Protected routes:
Logged-out users are redirected away from dashboard, garden, profile, settings, and admin.

Role-based access:
Only users with `role: "admin"` can open the admin console.

Account status checks:
Disabled accounts cannot log in.

Failed login tracking:
The fake database counts failed login attempts.

Temporary lockout:
After five failed attempts, the account is locked for one minute.

Password strength:
Signup and password change require uppercase, lowercase, number, symbol, and at least eight characters. Password changes ask for confirmation through an in-app toast before updating the mock account.

Session tracking:
The app creates browser session ids and tracks active sessions for the admin table.

Session revocation:
The admin can clear a user's active sessions in the fake database.

Admin privacy:
Admins can manage account status but cannot read users' memory descriptions or uploaded media.

Per-account data:
Each logged-in user sees only their own memories in the frontend demo.

Deletion safety:
In the garden, clicking a memory opens details. Removing a memory uses a separate button and asks for confirmation through an in-app toast.

Low-light comfort:
The settings toggle changes the whole app shell to a darker comfort theme, including sidebar, navbar, panels, buttons, and tables, and saves that preference locally.

Profile picture:
Users can upload, edit, or remove a profile picture after an in-app toast confirmation. It is stored in the fake local database and appears in the profile page, sidebar, and navbar.

## Questions A Doctor Might Ask

Why no backend?
Because this is a Web 1/frontend project. The fake database keeps the demo inside React and `localStorage`.

Where are the usernames and passwords?
They are written in `src/data/mockAuth.ts`, like the admin credential demo.

Why use Context API?
It gives the whole app access to authentication state without passing props through every component.

Why protected routes?
They prevent unauthenticated users from opening pages such as dashboard, garden, profile, and admin.

Why use a custom dashboard registry?
It keeps the demo lighter and makes each row open the memory detail view directly.

Can admins see memories?
No. The admin page only reads account metadata from the fake database.

Are these real security features?
No. They are frontend demonstrations. Real security requires a backend.

How would you make it production-ready in Web 2?
Move users and sessions to a backend database, hash passwords on the server, enforce rate limits on the server, use secure cookies or server-issued tokens, add real email verification, use HTTPS, and add real two-factor authentication.
