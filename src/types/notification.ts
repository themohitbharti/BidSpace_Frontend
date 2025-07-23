export interface Notification {
  id: string;
  userId: string;
  auctionId: string;
  productId: string;
  message: string;
  time: string;
  type: "bid" | "auction_end" | "refund" | "purchase" | "general";
  read: boolean;
  readAt?: string;
}

export interface NotificationResponse {
  success: boolean;
  message: string;
  data: Notification[];
}
