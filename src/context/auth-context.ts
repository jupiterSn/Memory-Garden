import { createContext } from "react";

export type User = {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  status?: string;
  emailVerified?: boolean;
  createdAt?: string;
  lastLoginAt?: string | null;
  avatarUrl?: string;
};

export type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  updateUser: (user: User) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    name: string,
    email: string,
    password: string
  ) => Promise<void | Record<string, never>>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);
