import React, { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { getAccessToken } from "../api/axiosInstance";
import { getNotifications } from "../api/notificationApi";
import { WebSocketContext } from "./WebSocketContext";
import type { Notification } from "../types/notification";
import type { LiveBidMessage } from "../types/auction";
import type { WebSocketContextType } from "./WebSocketContext";

interface WebSocketProviderProps {
  children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const socketRef = useRef<Socket | null>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Fetch initial notifications
  const fetchInitialNotifications = useCallback(async () => {
    if (!isLoggedIn || !user) return;

    try {
      setNotificationsLoading(true);
      console.log("🔔 Fetching initial notifications...");
      const response = await getNotifications();
      if (response.success) {
        setNotifications(response.data);
        console.log(
          `✅ Loaded ${response.data.length} notifications, ${response.data.filter((n) => !n.read).length} unread`,
        );
      }
    } catch (error) {
      console.error("❌ Failed to fetch initial notifications:", error);
    } finally {
      setNotificationsLoading(false);
    }
  }, [isLoggedIn, user]);

  const addNotification = (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true, readAt: new Date().toISOString() }
          : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
        readAt: new Date().toISOString(),
      })),
    );
  };

  // Memoize auction room methods to prevent unnecessary re-renders
  const joinAuctionRoom = useCallback(
    (auctionId: string) => {
      if (socketRef.current && isConnected) {
        console.log("🚀 Joining auction room:", auctionId);
        socketRef.current.emit("joinAuctionRoom", auctionId);
      } else {
        console.warn("Cannot join auction room: Socket not connected");
      }
    },
    [isConnected],
  );

  const leaveAuctionRoom = useCallback((auctionId: string) => {
    if (socketRef.current) {
      console.log("🚪 Leaving auction room:", auctionId);
      socketRef.current.emit("leaveAuction", auctionId);
    }
  }, []);

  const onNewBid = useCallback((callback: (bid: LiveBidMessage) => void) => {
    if (socketRef.current) {
      socketRef.current.on("newBid", callback);
    }
  }, []);

  const offNewBid = useCallback((callback: (bid: LiveBidMessage) => void) => {
    if (socketRef.current) {
      socketRef.current.off("newBid", callback);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn && user) {
      const token = getAccessToken();

      if (!token) {
        console.warn("No access token available for WebSocket connection");
        return;
      }

      console.log("🔌 Establishing WebSocket connection...");

      const socketInstance = io(
        import.meta.env.VITE_API_URL || "http://localhost:3000",
        {
          auth: {
            token: token,
          },
          transports: ["websocket", "polling"],
          forceNew: true,
        },
      );

      socketInstance.on("connect", () => {
        console.log("✅ WebSocket connected successfully:", socketInstance.id);
        setIsConnected(true);

        // Fetch initial notifications when socket connects
        fetchInitialNotifications();
      });

      socketInstance.on("connected", (data) => {
        console.log("🎉 Authentication successful:", data);
      });

      socketInstance.on("notification", (notification: Notification) => {
        console.log("🔔 New notification received:", notification);
        addNotification(notification);

        // Show browser notification if permission granted
        if (globalThis.Notification.permission === "granted") {
          new globalThis.Notification("BidSpace Notification", {
            body: notification.message,
            icon: "/favicon.svg",
          });
        }
      });

      socketInstance.on("disconnect", (reason) => {
        console.log("❌ WebSocket disconnected:", reason);
        setIsConnected(false);
      });

      socketInstance.on("connect_error", (error) => {
        console.error("🚨 WebSocket connection error:", error);
        setIsConnected(false);
      });

      setSocket(socketInstance);
      socketRef.current = socketInstance;

      return () => {
        console.log("🧹 Cleaning up WebSocket connection...");
        socketInstance.disconnect();
        setSocket(null);
        socketRef.current = null;
        setIsConnected(false);
      };
    } else {
      // Clean up connection when user logs out
      if (socketRef.current) {
        socketRef.current.disconnect();
        setSocket(null);
        socketRef.current = null;
        setIsConnected(false);
        setNotifications([]);
      }
    }
  }, [isLoggedIn, user, fetchInitialNotifications]);

  // Request notification permission on mount
  useEffect(() => {
    if (
      "Notification" in window &&
      globalThis.Notification.permission === "default"
    ) {
      globalThis.Notification.requestPermission();
    }
  }, []);

  const value: WebSocketContextType = {
    socket,
    isConnected,
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    setNotifications,
    joinAuctionRoom,
    leaveAuctionRoom,
    onNewBid,
    offNewBid,
    notificationsLoading,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};
