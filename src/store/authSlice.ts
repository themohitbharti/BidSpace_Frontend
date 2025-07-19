import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types";

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
        wishlist: [],
        ...action.payload,
      } as User;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      if (state.user) {
        state.user = action.payload;
      }
    },
  },
});

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
