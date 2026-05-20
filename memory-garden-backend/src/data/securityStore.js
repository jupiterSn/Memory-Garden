export const sessions = [];

export const loginAttempts = new Map();

export const preTokenBlacklist = new Set();

export const sessionBlacklist = new Set();

export const userBlacklist = new Set();

export const securityEvents = [];

export const globalInvalidation = {
  invalidatedAt: 0,
};
