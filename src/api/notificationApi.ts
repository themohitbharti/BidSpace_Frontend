import axiosInstance from "./axiosInstance";

export interface Notification {
  userId: string;
  auctionId: string;
  productId: string; // Add productId
  message: string;
  time: string;
  read?: boolean;
}

export interface NotificationResponse {
  success: boolean;
  message: string;
  data: Notification[];
}

export const getNotifications = async (): Promise<NotificationResponse> => {
  const response =
    await axiosInstance.get<NotificationResponse>("user/notifications");
  return response.data;
};
