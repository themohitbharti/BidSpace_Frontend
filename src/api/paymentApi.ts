import axiosInstance from "./axiosInstance";

export interface CreateOrderRequest {
  amount: number; // Amount in rupees
}

export interface CreateOrderResponse {
  success: boolean;
  orderId: string;
  amount_in_paise: number;
  currency: string;
}

export interface VerifyPaymentRequest {
  paymentId: string;
  orderId: string;
  signature: string;
  amount: number;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
}

export interface CheckPurseResponse {
  success: boolean;
  coins: number;
  reservedCoins: number;
  overallCoins: number;
}

// Create Razorpay order
export const createOrder = async (
  data: CreateOrderRequest,
): Promise<CreateOrderResponse> => {
  const response = await axiosInstance.post("/payment/order", data);
  return response.data;
};

// Verify payment after successful transaction
export const verifyPayment = async (
  data: VerifyPaymentRequest,
): Promise<VerifyPaymentResponse> => {
  const response = await axiosInstance.post("/payment/verify-payment", data);
  return response.data;
};

// Check user's current coin balance
export const checkPurse = async (): Promise<CheckPurseResponse> => {
  const response = await axiosInstance.get("/payment/check-purse");
  return response.data;
};
