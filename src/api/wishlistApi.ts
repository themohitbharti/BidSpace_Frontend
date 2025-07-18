import axiosInstance from "./axiosInstance";

export type WishlistResponse = {
  success: boolean;
  message: string;
};

export async function getWishlist() {
  const response = await axiosInstance.get("/wishlist");
  // Make sure this returns { data: [...] }
  return { data: response.data.data };
}

export const addToWishlist = async (
  productId: string,
): Promise<WishlistResponse> => {
  const res = await axiosInstance.post("/wishlist/add", { productId });
  return res.data;
};

export const removeFromWishlist = async (
  productId: string,
): Promise<WishlistResponse> => {
  const res = await axiosInstance.post("/wishlist/remove", { productId });
  return res.data;
};
