import axiosInstance from "./axiosInstance";

interface LoginPayload {
  email: string;
  password: string;
}

interface User {
  _id: string;
  email: string;
  fullName: string;
  productsListed: string[];
  productsPurchased: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  reservedCoins: number;
  coins: number;
}

interface SignupPayload extends LoginPayload {
  fullName: string;
}

interface VerifyOTPPayload extends SignupPayload {
  otp: string;
}

export interface TokenResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
  user: User;
}

export const loginUser = async (data: LoginPayload) => {
  const response = await axiosInstance.post("/user/login", data);
  return response.data;
};

export const registerUser = async (data: SignupPayload) => {
  const response = await axiosInstance.post("/user/register", data);
  return response.data;
};

export const verifyOTP = async (data: VerifyOTPPayload) => {
  const response = await axiosInstance.post("/user/verify-otp", data);
  return response.data;
};

export const logoutUser = async () => {
  const response = await axiosInstance.post(
    "/user/logout",
    {}
  );
  return response.data;
};

export const regenerateToken = async (): Promise<TokenResponse> => {
  const { data } = await axiosInstance.post<TokenResponse>(
    "/user/regenerate-tokens",
  );
  return data;
};
