import axiosInstance from "./axiosInstance";

// Interface for profile update request
interface ProfileUpdateRequest {
  fullName: string;
}

// Interface for password change request
interface PasswordChangeRequest {
  oldPassword: string;
  newPassword: string;
}

// Interface for user data in response
export interface User {
  _id: string;
  email: string;
  fullName: string;
  coins: number;
  reservedCoins: number;
  productsListed: string[];
  productsPurchased: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Profile update response
export interface ProfileUpdateResponse {
  success: boolean;
  message: string;
  data: User;
}

// Password change response
export interface PasswordChangeResponse {
  success: boolean;
  message: string;
}

/**
 * Update user profile
 * @param data - Profile data to update
 * @returns Updated user data
 */
export const updateUserProfile = async (
  data: ProfileUpdateRequest,
): Promise<ProfileUpdateResponse> => {
  const response = await axiosInstance.put<ProfileUpdateResponse>(
    "/user/edit",
    data,
  );
  return response.data;
};

/**
 * Change user password
 * @param data - Password change data
 * @returns Success message
 */
export const changeUserPassword = async (
  data: PasswordChangeRequest,
): Promise<PasswordChangeResponse> => {
  const response = await axiosInstance.post<PasswordChangeResponse>(
    "/user/change-password",
    data,
  );
  return response.data;
};
