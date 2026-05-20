const users = [
  {
    id: 1,
    name: "Memory Garden Admin",
    email: "admin@memorygarden.local",
    password: "$2b$10$EQkNjfiOxZ12rdFhpgsyC.rbxoy14LRk9gy3pf80Oe5xZqjJNifHC",
    role: "admin",
    status: "active",
    createdAt: new Date("2026-05-20T00:00:00.000Z").toISOString(),
    lastLoginAt: null,
    trustedDevices: [],
    userInvalidatedAt: 0,
    failedLoginCount: 0,
    requiresTwoFactor: false,
  },
];

export default users;
