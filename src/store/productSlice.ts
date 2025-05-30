import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { getProductDetails, placeBid as placeBidApi } from "../api/productApi";
import { Product, Auction, ProductAuctionResponse } from "../types";

// Product state interface
interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  auctions: Auction[];
  selectedAuction: Auction | null;
  loading: boolean;
  error: string | null;
  bidLoading?: boolean;
  bidError?: string | null;
}

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  auctions: [],
  selectedAuction: null,
  loading: false,
  error: null,
  bidLoading: false,
  bidError: null,
};

// Updated thunk to use the API function
export const fetchProductDetails = createAsyncThunk(
  "product/fetchDetails",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await getProductDetails(productId);
      return response.data; // The API function already returns response.data
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosError.response?.data?.message || "Failed to fetch product details",
      );
    }
  },
);

export const placeBid = createAsyncThunk(
  "product/placeBid",
  async (
    { auctionId, bidAmount }: { auctionId: string; bidAmount: number },
    { rejectWithValue },
  ) => {
    try {
      const response = await placeBidApi(auctionId, bidAmount);

      const data = response.data;

      if (!data.success) {
        return rejectWithValue(data.message || "Failed to place bid");
      }

      return data.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosError.response?.data?.message || "Failed to place bid",
      );
    }
  },
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },

    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },

    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
    },

    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex(
        (p) => p._id === action.payload._id,
      );
      if (index !== -1) {
        state.products[index] = action.payload;
      }
      if (
        state.selectedProduct &&
        state.selectedProduct._id === action.payload._id
      ) {
        state.selectedProduct = action.payload;
      }
    },

    setAuctions: (state, action: PayloadAction<Auction[]>) => {
      state.auctions = action.payload;
    },

    setSelectedAuction: (state, action: PayloadAction<Auction | null>) => {
      state.selectedAuction = action.payload;
    },

    updateAuction: (state, action: PayloadAction<Auction>) => {
      const index = state.auctions.findIndex(
        (a) => a._id === action.payload._id,
      );
      if (index !== -1) {
        state.auctions[index] = action.payload;
      }
      if (
        state.selectedAuction &&
        state.selectedAuction._id === action.payload._id
      ) {
        state.selectedAuction = action.payload;
      }
    },

    // Add a product and its auction at the same time
    addProductWithAuction: (
      state,
      action: PayloadAction<ProductAuctionResponse>,
    ) => {
      const { product, auction } = action.payload;
      state.products.push(product);
      state.auctions.push(auction);
      state.selectedProduct = product;
      state.selectedAuction = auction;
    },

    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
      state.selectedAuction = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload.product;
        state.selectedAuction = action.payload.auction;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(placeBid.pending, (state) => {
        state.bidLoading = true;
        state.bidError = null;
      })
      .addCase(placeBid.fulfilled, (state, action) => {
        state.bidLoading = false;
        // Update the current auction with the new data
        state.selectedAuction = action.payload.auction;
      })
      .addCase(placeBid.rejected, (state, action) => {
        state.bidLoading = false;
        state.bidError = action.payload as string;
      });
  },
});

export const {
  setLoading,
  setError,
  setProducts,
  setSelectedProduct,
  addProduct,
  updateProduct,
  setAuctions,
  setSelectedAuction,
  updateAuction,
  addProductWithAuction,
  clearSelectedProduct,
} = productSlice.actions;

export default productSlice.reducer;
