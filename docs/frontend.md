# Frontend Documentation

## Authentication

`AuthContext` stores:

- current user
- JWT token
- authentication state
- login function
- signup function
- logout function

`useAuth` is a wrapper hook that ensures auth state is only consumed inside the provider.

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

`ProtectedRoute` prevents unauthenticated users from entering the application shell.

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
- optional image or video

Images are converted into persistent browser data URLs so they remain visible after logout or refresh on the same browser.

## Dashboard

The dashboard uses AG Grid to display memory data in a filterable, sortable registry. It also includes summary cards and recent memory previews.
