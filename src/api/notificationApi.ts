import axiosInstance from "./axiosInstance";
import { NotificationResponse } from "../types/notification";

export const getNotifications = async (): Promise<NotificationResponse> => {
  const response =
    await axiosInstance.get<NotificationResponse>("user/notifications");
  return response.data;
};

export const markNotificationAsRead = async (notificationId: string) => {
  const response = await axiosInstance.post("/user/notifications/read", {
    notificationId,
  });
  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await axiosInstance.post(
    "/user/notifications/read-all",
  );
  return response.data;
};
