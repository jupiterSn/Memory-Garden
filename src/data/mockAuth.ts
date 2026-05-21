import type { User } from "@/context/auth-context";

export type DemoUser = User & {
  password: string;
  failedLoginCount: number;
  activeSessions: string[];
  lockedUntil?: string | null;
};

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  status: "active" | "disabled" | "review";
  activeSessions: number;
  failedLoginCount: number;
  emailVerified?: boolean;
  avatarUrl?: string;
};

export type SecuritySummary = {
  activeSessions: number;
  blacklistedSessions: number;
  blacklistedUsers: number;
};

const USERS_KEY = "memory-garden-demo-users";
const BLOCKED_SESSIONS_KEY = "memory-garden-blocked-sessions";
const MAX_FAILED_LOGINS = 5;
const LOCKOUT_MS = 60_000;

const seedUsers: DemoUser[] = [
  {
    id: 1,
    name: "Garden Admin",
    email: "admin@memorygarden.local",
    password: "Admin@12345",
    role: "admin",
    status: "active",
    emailVerified: true,
    createdAt: "2026-05-15T10:00:00.000Z",
    lastLoginAt: null,
    avatarUrl: "",
    failedLoginCount: 0,
    activeSessions: [],
    lockedUntil: null,
  },
  {
    id: 2,
    name: "Demo User",
    email: "user@memorygarden.local",
    password: "User@12345",
    role: "user",
    status: "active",
    emailVerified: true,
    createdAt: "2026-05-16T10:00:00.000Z",
    lastLoginAt: null,
    avatarUrl: "",
    failedLoginCount: 0,
    activeSessions: [],
    lockedUntil: null,
  },
];

function readUsers() {
  const savedUsers = localStorage.getItem(USERS_KEY);
  if (!savedUsers) {
    localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers));
    return seedUsers;
  }

  return JSON.parse(savedUsers) as DemoUser[];
}

function saveUsers(users: DemoUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function readBlockedSessions() {
  return JSON.parse(localStorage.getItem(BLOCKED_SESSIONS_KEY) ?? "[]") as string[];
}

function saveBlockedSessions(sessionIds: string[]) {
  localStorage.setItem(BLOCKED_SESSIONS_KEY, JSON.stringify(sessionIds));
}

function createSessionId() {
  return crypto.randomUUID();
}

function toPublicUser(user: DemoUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,
    avatarUrl: user.avatarUrl,
  };
}

function requireStrongPassword(password: string) {
  const strongEnough =
    password.length >= 8 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password);

  if (!strongEnough) {
    throw new Error(
      "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol."
    );
  }
}

export function loginWithDemoDatabase(email: string, password: string) {
  const users = readUsers();
  const userIndex = users.findIndex(
    (candidate) => candidate.email.toLowerCase() === email.trim().toLowerCase()
  );

  if (userIndex === -1) {
    throw new Error("Invalid email or password.");
  }

  const user = users[userIndex];

  if (user.status === "disabled") {
    throw new Error("This account is disabled.");
  }

  if (user.lockedUntil && new Date(user.lockedUntil).getTime() > Date.now()) {
    throw new Error("Too many failed attempts. Try again in one minute.");
  }

  if (user.password !== password) {
    const failedLoginCount = user.failedLoginCount + 1;
    users[userIndex] = {
      ...user,
      failedLoginCount,
      lockedUntil:
        failedLoginCount >= MAX_FAILED_LOGINS
          ? new Date(Date.now() + LOCKOUT_MS).toISOString()
          : null,
    };
    saveUsers(users);
    throw new Error("Invalid email or password.");
  }

  const sessionId = createSessionId();
  users[userIndex] = {
    ...user,
    failedLoginCount: 0,
    lockedUntil: null,
    activeSessions: [...user.activeSessions, sessionId],
    lastLoginAt: new Date().toISOString(),
  };
  saveUsers(users);

  return {
    sessionId,
    user: toPublicUser(users[userIndex]),
  };
}

export function signupWithDemoDatabase(name: string, email: string, password: string) {
  requireStrongPassword(password);

  const users = readUsers();
  const emailExists = users.some(
    (user) => user.email.toLowerCase() === email.trim().toLowerCase()
  );

  if (emailExists) {
    throw new Error("That email is already registered.");
  }

  const user: DemoUser = {
    id: Math.max(...users.map((savedUser) => savedUser.id), 0) + 1,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    role: "user",
    status: "active",
    emailVerified: true,
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
    failedLoginCount: 0,
    activeSessions: [],
    lockedUntil: null,
  };

  saveUsers([...users, user]);

  return {
    user: toPublicUser(user),
  };
}

export function updateDemoUserProfile(
  currentUser: User,
  name: string,
  email: string,
  avatarUrl?: string
) {
  const users = readUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const userIndex = users.findIndex((user) => user.id === currentUser.id);

  if (userIndex === -1) {
    throw new Error("Current user was not found.");
  }

  const emailTaken = users.some(
    (user) => user.id !== currentUser.id && user.email === normalizedEmail
  );

  if (emailTaken) {
    throw new Error("That email belongs to another account.");
  }

  users[userIndex] = {
    ...users[userIndex],
    name: name.trim(),
    email: normalizedEmail,
    avatarUrl: avatarUrl ?? users[userIndex].avatarUrl,
  };
  saveUsers(users);

  return toPublicUser(users[userIndex]);
}

export function exportDemoAccount(currentUser: User) {
  const users = readUsers();
  const user = users.find((candidate) => candidate.id === currentUser.id);

  if (!user) {
    throw new Error("Current user was not found.");
  }

  return {
    account: toPublicUser(user),
    security: {
      failedLoginCount: user.failedLoginCount,
      activeSessions: user.activeSessions.length,
      passwordStoredInCodeForFrontendDemo: true,
    },
  };
}

export function changeDemoPassword(
  currentUser: User,
  currentPassword: string,
  newPassword: string
) {
  requireStrongPassword(newPassword);

  const users = readUsers();
  const userIndex = users.findIndex((user) => user.id === currentUser.id);

  if (userIndex === -1 || users[userIndex].password !== currentPassword) {
    throw new Error("Current password is incorrect.");
  }

  const blockedSessions = readBlockedSessions();
  saveBlockedSessions([...blockedSessions, ...users[userIndex].activeSessions]);

  users[userIndex] = {
    ...users[userIndex],
    password: newPassword,
    activeSessions: [],
  };
  saveUsers(users);
}

export function saveDemoPreferences(preferences: Record<string, boolean>) {
  localStorage.setItem("memory-garden-preferences", JSON.stringify(preferences));
}

export function getDemoPreferences() {
  return JSON.parse(localStorage.getItem("memory-garden-preferences") ?? "{}") as
    | Record<string, boolean>
    | undefined;
}

export function getAdminUsers(): AdminUser[] {
  return readUsers().map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status as AdminUser["status"],
    activeSessions: user.activeSessions.length,
    failedLoginCount: user.failedLoginCount,
    emailVerified: user.emailVerified,
    avatarUrl: user.avatarUrl,
  }));
}

export function getSecuritySummary(): SecuritySummary {
  const users = readUsers();

  return {
    activeSessions: users.reduce((total, user) => total + user.activeSessions.length, 0),
    blacklistedSessions: readBlockedSessions().length,
    blacklistedUsers: users.filter((user) => user.status === "disabled").length,
  };
}

export function createAdminUser(userInput: {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
}) {
  requireStrongPassword(userInput.password);

  const users = readUsers();
  const emailExists = users.some(
    (user) => user.email.toLowerCase() === userInput.email.trim().toLowerCase()
  );

  if (emailExists) {
    throw new Error("That email is already registered.");
  }

  saveUsers([
    ...users,
    {
      id: Math.max(...users.map((user) => user.id), 0) + 1,
      name: userInput.name.trim(),
      email: userInput.email.trim().toLowerCase(),
      password: userInput.password,
      role: userInput.role,
      status: "active",
      emailVerified: true,
      createdAt: new Date().toISOString(),
      lastLoginAt: null,
      avatarUrl: "",
      failedLoginCount: 0,
      activeSessions: [],
      lockedUntil: null,
    },
  ]);
}

export function updateAdminUserStatus(userId: number, status: AdminUser["status"]) {
  const users = readUsers();
  saveUsers(users.map((user) => (user.id === userId ? { ...user, status } : user)));
}

export function revokeAdminUserSessions(userId: number) {
  const users = readUsers();
  const blockedSessions = readBlockedSessions();
  const targetUser = users.find((user) => user.id === userId);

  if (targetUser) {
    saveBlockedSessions([...blockedSessions, ...targetUser.activeSessions]);
  }

  saveUsers(
    users.map((user) =>
      user.id === userId ? { ...user, activeSessions: [] } : user
    )
  );
}

export function deleteAdminUser(userId: number) {
  saveUsers(readUsers().filter((user) => user.id !== userId));
}
