import { createContext } from "react";

export type User = {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  status?: string;
  createdAt?: string;
  lastLoginAt?: string | null;
};

export type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);
