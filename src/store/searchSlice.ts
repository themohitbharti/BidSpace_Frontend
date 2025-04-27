import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { searchProducts as searchProductsApi } from "../api/productApi"; // Import API function

// Define product interface based on your API response
export interface SearchProduct {
  _id: string;
  title: string;
  basePrice: number;
  category: string;
  coverImages: string[];
  status: "live" | "sold" | "unsold";
  finalBid?: {
    userId: string;
    bidAmount: number;
  };
  finalSoldPrice?: number;
}

interface SearchState {
  recentSearches: string[];
  searchResults: SearchProduct[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SearchState = {
  recentSearches: [],
  searchResults: [],
  isLoading: false,
  error: null,
};

// Updated thunk to use the API function
export const searchProducts = createAsyncThunk(
  "search/searchProducts",
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await searchProductsApi(query);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosError.response?.data?.message || "Search failed",
      );
    }
  },
);

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    addRecentSearch: (state, action: PayloadAction<string>) => {
      // Remove if already exists (to avoid duplicates)
      state.recentSearches = state.recentSearches.filter(
        (search) => search !== action.payload,
      );

      // Add to the beginning of the array
      state.recentSearches.unshift(action.payload);

      // Keep only the most recent 5 searches
      state.recentSearches = state.recentSearches.slice(0, 5);
    },
    clearRecentSearches: (state) => {
      state.recentSearches = [];
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addRecentSearch, clearRecentSearches, clearSearchResults } =
  searchSlice.actions;

export default searchSlice.reducer;
