import { useState, type ReactNode } from "react";

import apiClient from "@/api/apiClient";
import { AuthContext, type User } from "@/context/auth-context";

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
    const response = await apiClient.post("/auth/login", {
      email,
      password,
    });

    const receivedToken = response.data.token;
    const receivedUser = response.data.user;

    localStorage.setItem("memory-garden-token", receivedToken);
    localStorage.setItem("memory-garden-user", JSON.stringify(receivedUser));

    setToken(receivedToken);
    setUser(receivedUser);
  };

  const signup = async (name: string, email: string, password: string) => {
    const response = await apiClient.post("/auth/signup", {
      name,
      email,
      password,
    });

    const receivedToken = response.data.token;
    const receivedUser = response.data.user;

    localStorage.setItem("memory-garden-remembered-email", email);

    if (receivedToken && receivedUser) {
      localStorage.setItem("memory-garden-token", receivedToken);
      localStorage.setItem("memory-garden-user", JSON.stringify(receivedUser));

      setToken(receivedToken);
      setUser(receivedUser);
    }

    return {
      emailVerificationRequired: response.data.emailVerificationRequired,
      verificationUrl: response.data.verificationUrl,
    };
  };

  const logout = () => {
    localStorage.removeItem("memory-garden-token");
    localStorage.removeItem("memory-garden-user");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
