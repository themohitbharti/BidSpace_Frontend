import axiosInstance from "./axiosInstance";
import { Product, Bidder, Auction } from "../types"; // Import all needed types

// Use the imported types in your interfaces
export interface ProductDetailsResponse {
  success: boolean;
  message: string;
  data: {
    product: Product;
    auction: Auction;
    liveBids: Bidder[];
  };
}

/**
 * Interface for reserved products response
 */
export interface ReservedProductsResponse {
  success: boolean;
  message: string;
  data: Product[];
}

/**
 * Get product details by ID
 * @param productId - The ID of the product to fetch
 * @returns API response with product and auction details
 */
export const getProductDetails = async (productId: string) => {
  const response = await axiosInstance.get<ProductDetailsResponse>(
    `/product/details/${productId}`,
  );
  return response.data;
};

/**
 * Search for products
 * @param query - The search term
 * @returns Array of matching products
 */
export const searchProducts = async (query: string) => {
  const response = await axiosInstance.get(
    `/product/search?query=${encodeURIComponent(query)}`,
  );
  return response.data;
};

/**
 * Upload a new product
 * @param formData - Form data containing product details and images
 * @returns Created product and auction details
 */
export const uploadProduct = async (formData: FormData) => {
  const response = await axiosInstance.post("/product/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getRecentProducts = async () => {
  const response = await axiosInstance.get("/product/recent");
  return response.data;
};

export const getTrendingProducts = async () => {
  const response = await axiosInstance.get("/product/trending");
  return response.data;
};

export const placeBid = async (auctionId: string, bidAmount: number) => {
  return await axiosInstance.post("/auction/bid", {
    auctionId,
    bidAmount: bidAmount.toString(),
  });
};

export const getProductsByCategory = async (
  category: string = "all",
  status: string = "live",
  page: number = 1,
  limit: number = 10,
) => {
  const response = await axiosInstance.get(
    `/product/list/${category}/${status}?page=${page}&limit=${limit}`,
  );
  return response.data;
};

/**
 * Get products purchased by the current user
 * @returns Purchased products response
 */
export interface UserProductsResponse {
  success: boolean;
  message: string;
  data: Product[];
}

/**
 * Get products purchased by the current user
 * @returns Purchased products response
 */
export const getPurchasedProducts = async (): Promise<UserProductsResponse> => {
  const response =
    await axiosInstance.get<UserProductsResponse>("/product/purchased");
  return response.data;
};

/**
 * Get products listed by the current user
 * @returns Listed products response
 */
export const getListedProducts = async (): Promise<UserProductsResponse> => {
  const response =
    await axiosInstance.get<UserProductsResponse>("/product/listed");
  return response.data;
};

/**
 * Get reserved/waiting products for the current user
 * @returns Reserved products response
 */
export const getReservedProducts = async (): Promise<UserProductsResponse> => {
  const response =
    await axiosInstance.get<UserProductsResponse>("/product/waiting");
  return response.data;
};
