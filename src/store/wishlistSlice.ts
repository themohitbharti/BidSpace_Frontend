import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "../api/wishlistApi";
import type { AxiosError } from "axios";
import type { WishlistResponse } from "../api/wishlistApi";

interface WishlistState {
  items: string[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};

// Async actions
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getWishlist();
      return res; // res is string[]
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      return rejectWithValue(
        axiosErr.response?.data?.message || "Failed to fetch wishlist",
      );
    }
  },
);

export const addWishlistItem = createAsyncThunk<WishlistResponse, string>(
  "wishlist/addWishlistItem",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await addToWishlist(productId);
      if (!res.success) {
        return rejectWithValue(res.message || "Failed to add to wishlist");
      }
      return res;
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      return rejectWithValue(
        axiosErr.response?.data?.message || "Failed to add to wishlist",
      );
    }
  },
);

export const removeWishlistItem = createAsyncThunk<WishlistResponse, string>(
  "wishlist/removeWishlistItem",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await removeFromWishlist(productId);
      if (!res.success) {
        return rejectWithValue(res.message || "Failed to remove from wishlist");
      }
      return res;
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
        (state, action: PayloadAction<string[]>) => {
          state.loading = false;
          state.items = action.payload;
        },
      )
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(
        addWishlistItem.fulfilled,
        (
          state,
          action: PayloadAction<WishlistResponse, string, { arg: string }>,
        ) => {
          // Only add if success and not already present
          if (
            action.payload.success &&
            !state.items.includes(action.meta.arg)
          ) {
            state.items.push(action.meta.arg);
          }
        },
      )
      .addCase(
        removeWishlistItem.fulfilled,
        (
          state,
          action: PayloadAction<WishlistResponse, string, { arg: string }>,
        ) => {
          // Only remove if success
          if (action.payload.success) {
            state.items = state.items.filter((id) => id !== action.meta.arg);
          }
        },
      );
  },
});

export default wishlistSlice.reducer;
