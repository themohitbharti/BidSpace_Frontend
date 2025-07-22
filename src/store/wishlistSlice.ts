import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "../api/wishlistApi";
import type { AxiosError } from "axios";
import { Product } from "../types";
import { RootState } from "./store";

interface WishlistState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};

// Fetch full product objects for wishlist
export const fetchWishlist = createAsyncThunk<Product[]>(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue, getState }) => {
    try {
      // Check if user is logged in before making the request
      const state = getState() as RootState;
      const isLoggedIn = state.auth.isLoggedIn;

      if (!isLoggedIn) {
        return []; // Return empty array for non-logged in users
      }

      const res = await getWishlist();
      if (!Array.isArray(res.data)) throw new Error("Invalid wishlist data");
      return res.data as Product[];
    } catch (err: unknown) {
      if (err instanceof Error) return rejectWithValue(err.message);
      return rejectWithValue("Failed to fetch wishlist");
    }
  },
);

// Add product to wishlist (by productId)
export const addWishlistItem = createAsyncThunk<{ message: string }, string>(
  "wishlist/addWishlistItem",
  async (productId, { rejectWithValue, dispatch }) => {
    try {
      const res = await addToWishlist(productId);
      if (!res.success)
        return rejectWithValue(res.message || "Failed to add to wishlist");
      // Refresh wishlist after add
      await dispatch(fetchWishlist());
      return { message: res.message || "Added to wishlist" };
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      return rejectWithValue(
        axiosErr.response?.data?.message || "Failed to add to wishlist",
      );
    }
  },
);

// Remove product from wishlist (by productId)
export const removeWishlistItem = createAsyncThunk<{ message: string }, string>(
  "wishlist/removeWishlistItem",
  async (productId, { rejectWithValue, dispatch }) => {
    try {
      const res = await removeFromWishlist(productId);
      if (!res.success)
        return rejectWithValue(res.message || "Failed to remove from wishlist");
      // Refresh wishlist after remove
      await dispatch(fetchWishlist());
      return { message: res.message || "Removed from wishlist" };
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      return rejectWithValue(
        axiosErr.response?.data?.message || "Failed to remove from wishlist",
      );
    }
  },
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchWishlist.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.loading = false;
          state.items = action.payload;
        },
      )
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    // No need to handle add/remove fulfilled, as fetchWishlist updates the state
  },
});

export default wishlistSlice.reducer;
