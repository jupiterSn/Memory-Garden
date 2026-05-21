# Admin Console

The admin console is available at `/admin` for users with `role: "admin"`.

## Admin Capabilities

Admins can:

- view user account metadata
- see account status
- see role
- see active session count
- see failed login count
- create user or admin accounts
- change account status
- revoke user sessions
- delete accounts
- view security summary metrics

Admins cannot:

- read memory descriptions
- view uploaded photos/videos
- inspect timeline details
- access another user's private garden data

## Default Admin

```text
Email: admin@memorygarden.local
Password: Admin@12345
```

## Why This Design Matters

This follows the principle of least privilege. The admin can protect the system and manage access without violating user privacy.

In this Web 1 version, all admin data comes from the frontend fake database in `src/data/mockAuth.ts`.
