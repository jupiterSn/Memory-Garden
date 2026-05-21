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
