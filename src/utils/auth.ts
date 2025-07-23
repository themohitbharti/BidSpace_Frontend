import { setAccessToken } from "../api/axiosInstance";

// Access the token from your axiosInstance module
// Since you're storing it in a module variable, we need to expose it
let currentAccessToken: string | null = null;

export const getAccessToken = (): string | null => {
  return currentAccessToken;
};

export const setCurrentAccessToken = (token: string | null) => {
  currentAccessToken = token;
  // Also set it in your axios instance
  setAccessToken(token);
};

// You'll need to call setCurrentAccessToken whenever you set the token
// in your login/auth functions
