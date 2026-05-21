# Frontend Documentation

## Authentication

`AuthContext` stores:

- current user
- browser session id
- authentication state
- login function
- signup function
- logout function

`useAuth` is a wrapper hook that ensures auth state is only consumed inside the provider.

The fake authentication database is in `src/data/mockAuth.ts`.

Signup creates the account in the fake database, remembers the email, and sends the user back to `/login` instead of opening the dashboard immediately.

## Routing

Public routes:

- `/`
- `/login`
- `/signup`

Protected routes:

- `/app`
- `/dashboard`
- `/plant`
- `/garden`
- `/timeline`
- `/profile`
- `/settings`
- `/admin`

`ProtectedRoute` prevents unauthenticated users from entering the application shell. The admin page also checks that the current user has `role: "admin"`.

## UI Design

The UI uses a soft garden visual language:

- baby pink accents
- sage and moss backgrounds
- wisteria auth screens
- sakura landing page with falling petals
- realistic garden bed canvas
- animated and interactive garden buttons

## Memory Features

Users can plant memories with:

- title
- description
- emotion
- date
- optional images and videos

Images are converted into persistent browser data URLs so they remain visible after logout or refresh on the same browser.

Each memory can store multiple media attachments in `mediaItems`. Older single-file memories still work through the legacy `mediaUrl` and `mediaType` fields.

Clicking a memory in the dashboard, garden, or timeline opens a full detail view with the story, date, emotion, and every attached image/video. Garden deletion is handled by a separate remove button with a toast confirmation.

Memories are saved per account with user-specific browser storage keys, so a new account starts with an empty dashboard, garden, and timeline.

## Dashboard

The dashboard uses AG Grid to display memory data in a filterable, sortable registry. It also includes summary cards and recent memory previews.

## Frontend Security Demonstrations

- Strong password rule for signup and password changes
- Login failure counter
- One-minute account lockout after five failed login attempts
- Disabled account check before login
- Protected route guard
- Admin-only route logic
- Session id generation in the browser
- Admin session revocation demo
- Admin metadata privacy: admins cannot see memory details

## Theme Preferences

The settings page stores garden preferences in browser storage. Low-light comfort changes the full protected app shell immediately, including sidebar, navbar, panels, buttons, and tables, and persists after refresh.

## Profile Pictures

The profile page lets users add, preview, save, edit, and remove a profile picture. The image is stored as a browser data URL inside the fake user database, then reused in the sidebar and navbar.
