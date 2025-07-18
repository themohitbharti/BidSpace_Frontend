import axiosInstance from "./axiosInstance";

type WishlistResponse = {
    success: boolean;
    message: string;
  };


export const getWishlist = async (): Promise<string[]> => {
  const res = await axiosInstance.get("/wishlist");
  return res.data;
};

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
