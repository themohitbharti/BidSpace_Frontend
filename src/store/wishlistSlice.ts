import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "../api/wishlistApi";
import type { AxiosError } from "axios"; // <-- Add this import

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

export const addWishlistItem = createAsyncThunk(
  "wishlist/addWishlistItem",
  async (productId: string, { rejectWithValue }) => {
    try {
        console.log("Adding to wishlist:", productId);
      await addToWishlist(productId);
      return productId;
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      return rejectWithValue(
        axiosErr.response?.data?.message || "Failed to add to wishlist",
      );
    }
  },
);

export const removeWishlistItem = createAsyncThunk(
  "wishlist/removeWishlistItem",
  async (productId: string, { rejectWithValue }) => {
    try {
      await removeFromWishlist(productId);
      return productId;
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
        (state, action: PayloadAction<string>) => {
          if (!state.items.includes(action.payload)) {
            state.items.push(action.payload);
          }
        },
      )
      .addCase(
        removeWishlistItem.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.items = state.items.filter((id) => id !== action.payload);
        },
      );
  },
});

export default wishlistSlice.reducer;
