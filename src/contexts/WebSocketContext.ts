import { createContext } from "react";
import type { Socket } from "socket.io-client";
import type { Notification } from "../types/notification";
import type { LiveBidMessage } from "../types/auction";

export interface WebSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  joinAuctionRoom: (auctionId: string) => void;
  leaveAuctionRoom: (auctionId: string) => void;
  onNewBid: (callback: (bid: LiveBidMessage) => void) => void;
  offNewBid: (callback: (bid: LiveBidMessage) => void) => void;
  notificationsLoading: boolean;
}

export const WebSocketContext = createContext<WebSocketContextType | null>(
  null,
);
