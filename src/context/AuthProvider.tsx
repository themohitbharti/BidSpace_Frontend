import React, { ReactNode, useEffect, useState } from "react";
import { regenerateToken } from "../api/auth";
import { setAccessToken } from "../api/axiosInstance";
import { useDispatch } from "react-redux";
import {
  login as loginAction,
  logout as logoutAction,
} from "../store/authSlice";
import { AuthContext } from "./AuthContext";

// Define the User type to match what's expected in the loginAction
interface User {
  _id: string;
  email: string;
  fullName: string;
  productsListed: string[];
  productsPurchased: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  reservedCoins: number;
  coins: number;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    regenerateToken()
      .then(({ accessToken, user }) => {
        setAccessToken(accessToken);
        // Type assertion to ensure user matches the expected type
        dispatch(loginAction(user as User));
        setIsAuthenticated(true);
      })
      .catch(() => {
        setIsAuthenticated(false);
        dispatch(logoutAction());
      })
      .finally(() => setLoading(false));
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ loading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
