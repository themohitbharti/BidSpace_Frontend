import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
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

// Define a type for the minimum required user data
export type PartialUser = Partial<User> & {
  _id: string;
  email: string;
  fullName: string;
};

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<PartialUser>) => {
      state.isLoggedIn = true;
      // Merge with default values for missing properties
      state.user = {
        productsListed: [],
        productsPurchased: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __v: 0,
        reservedCoins: 0,
        coins: 0,
        ...action.payload,
      } as User;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
    },
    // Add the updateUser action
    updateUser: (state, action: PayloadAction<User>) => {
      if (state.user) {
        state.user = action.payload;
      }
    },
  },
});

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
