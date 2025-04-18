import { createContext } from "react";

export interface AuthContextType {
  loading: boolean;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  loading: true,
  isAuthenticated: false,
});
