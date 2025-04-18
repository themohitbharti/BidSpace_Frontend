import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Product interface
export interface Product {
  _id: string;
  title: string;
  basePrice: number;
  description: string;
  category: string;
  coverImages: string[];
  listedBy: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  auctionId?: string;
}

// Auction interface
export interface Auction {
  _id: string;
  productId: string;
  startPrice: number;
  currentPrice: number;
  endTime: string;
  bidders: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Combined product and auction response
export interface ProductAuctionResponse {
  product: Product;
  auction: Auction;
}

// Product state interface
interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  auctions: Auction[];
  selectedAuction: Auction | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  auctions: [],
  selectedAuction: null,
  loading: false,
  error: null,
};

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
      const index = state.products.findIndex(p => p._id === action.payload._id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
      if (state.selectedProduct && state.selectedProduct._id === action.payload._id) {
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
      const index = state.auctions.findIndex(a => a._id === action.payload._id);
      if (index !== -1) {
        state.auctions[index] = action.payload;
      }
      if (state.selectedAuction && state.selectedAuction._id === action.payload._id) {
        state.selectedAuction = action.payload;
      }
    },
    
    // Add a product and its auction at the same time
    addProductWithAuction: (state, action: PayloadAction<ProductAuctionResponse>) => {
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