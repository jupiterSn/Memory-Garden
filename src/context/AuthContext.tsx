import {
  createContext,
  useState,
  type ReactNode,
} from "react";

import apiClient from "@/api/apiClient";

type User = {
  id: number;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("memory-garden-token");
  });

  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("memory-garden-user");

    if (!savedUser) return null;

    return JSON.parse(savedUser);
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
    localStorage.setItem(
      "memory-garden-user",
      JSON.stringify(receivedUser)
    );

    setToken(receivedToken);
    setUser(receivedUser);
  };

  const signup = async (
    name: string,
    email: string,
    password: string
  ) => {
    const response = await apiClient.post("/auth/signup", {
      name,
      email,
      password,
    });

    const receivedToken = response.data.token;
    const receivedUser = response.data.user;

    localStorage.setItem("memory-garden-token", receivedToken);
    localStorage.setItem(
      "memory-garden-user",
      JSON.stringify(receivedUser)
    );

    setToken(receivedToken);
    setUser(receivedUser);
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
export { AuthContext };