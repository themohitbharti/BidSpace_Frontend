import React, { ReactNode, useEffect, useState } from "react";
import { regenerateToken } from "../api/auth";
import { setAccessToken } from "../api/axiosInstance";
import { useDispatch } from "react-redux";
import {
  login as loginAction,
  logout as logoutAction,
} from "../store/authSlice";
import { AuthContext } from "./AuthContext";
import { AppLoader } from "../components";

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

interface TokenResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
  user: User;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const startTime = Date.now();
    const minDisplayTime = 700; // 1 second minimum

    regenerateToken()
      .then((response: TokenResponse) => {
        setAccessToken(response.data.accessToken);
        const user = response.user;
        dispatch(loginAction(user as User));
        setIsAuthenticated(true);
      })
      .catch(() => {
        setIsAuthenticated(false);
        dispatch(logoutAction());
      })
      .finally(() => {
        // Calculate how long the auth check took
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

        // Wait for the remaining time to reach minimum display duration
        setTimeout(() => {
          setLoading(false);
        }, remainingTime);
      });
  }, [dispatch]);

  if (loading) return <AppLoader />;

  return (
    <AuthContext.Provider value={{ loading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
