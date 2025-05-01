import axiosInstance from "./axiosInstance";

// Define a bidder interface to match your data structure
export interface Bidder {
  userId: string;
  bidAmount: number;
  _id: string;
}

// Define the response interfaces
export interface ProductDetailsResponse {
  success: boolean;
  message: string;
  data: {
    product: {
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
      finalSoldPrice?: number;
    };
    auction: {
      _id: string;
      productId: string;
      startPrice: number;
      currentPrice: number;
      endTime: string;
      bidders: Bidder[]; // Use the Bidder interface instead of any[]
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
    liveBids: Bidder[]; // Use the same Bidder interface for liveBids
  };
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
