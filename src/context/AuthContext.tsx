import { useState, type ReactNode } from "react";

import { AuthContext, type User } from "@/context/auth-context";
import {
  loginWithDemoDatabase,
  signupWithDemoDatabase,
} from "@/data/mockAuth";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("memory-garden-token")
  );

  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("memory-garden-user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const isAuthenticated = Boolean(token && user);

  const login = async (email: string, password: string) => {
    const { sessionId, user: receivedUser } = loginWithDemoDatabase(email, password);

    localStorage.setItem("memory-garden-token", sessionId);
    localStorage.setItem("memory-garden-user", JSON.stringify(receivedUser));

    setToken(sessionId);
    setUser(receivedUser);
  };

  const signup = async (name: string, email: string, password: string) => {
    const { sessionId, user: receivedUser } = signupWithDemoDatabase(
      name,
      email,
      password
    );

    localStorage.setItem("memory-garden-remembered-email", email);
    localStorage.setItem("memory-garden-token", sessionId);
    localStorage.setItem("memory-garden-user", JSON.stringify(receivedUser));

    setToken(sessionId);
    setUser(receivedUser);

    return {};
  };

  const logout = () => {
    localStorage.removeItem("memory-garden-token");
    localStorage.removeItem("memory-garden-user");

    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    localStorage.setItem("memory-garden-user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        updateUser,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
