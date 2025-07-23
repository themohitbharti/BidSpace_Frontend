import React, { useState, useRef, useEffect } from "react";
import { FaBell, FaTimes, FaInfoCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../api/notificationApi";
import { formatDistanceToNow } from "date-fns";
import { useWebSocket } from "../../hooks/useWebSocket";
import type { Notification } from "../../types/notification"; // Use type-only import

const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    setNotifications,
    isConnected,
    notificationsLoading,
  } = useWebSocket();

  // Manual refresh function (separate from initial load)
  const fetchNotifications = async () => {
    try {
      setRefreshLoading(true);
      setError(null);
      const response = await getNotifications();
      if (response.success) {
        setNotifications(response.data);
      } else {
        setError("Failed to load notifications");
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications");
    } finally {
      setRefreshLoading(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read locally
    markAsRead(notification.id);

    // Mark as read on server
    try {
      await markNotificationAsRead(notification.id);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }

    // Navigate to product details page
    navigate(`/product-details/${notification.productId}`);
    setIsOpen(false);
  };

  const handleRefresh = () => {
    fetchNotifications();
  };

  const handleMarkAllAsRead = async () => {
    markAllAsRead();

    try {
      await markAllNotificationsAsRead();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
  };

  // Show loading indicator on initial load
  const isLoading = notificationsLoading || refreshLoading;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={handleDropdownToggle}
        className="relative flex h-10 items-center justify-center rounded-lg bg-blue-500/10 px-3 text-blue-300 transition-all hover:bg-blue-500/20 hover:shadow-[0_0_8px_rgba(59,130,246,0.2)]"
      >
        <FaBell className="h-4 w-4" />
        {/* Connection status indicator */}
        <div
          className={`absolute -top-0.5 -left-0.5 h-2 w-2 rounded-full ${
            isConnected ? "bg-green-400" : "bg-red-400"
          }`}
          title={isConnected ? "Connected" : "Disconnected"}
        />

        {/* Show unread count even during initial loading */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-12 right-0 z-50 max-h-96 w-80 overflow-hidden rounded-xl border border-gray-700/50 bg-gradient-to-b from-gray-800 to-gray-900 shadow-2xl backdrop-blur-sm">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-700/50 bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-4">
            <div className="flex items-center gap-2">
              <FaBell className="text-blue-400" />
              <h3 className="text-lg font-semibold text-white">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="rounded-full px-2 py-1 text-xs text-blue-400 transition-colors hover:bg-gray-700 hover:text-blue-300"
                  title="Mark all as read"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={handleRefresh}
                disabled={refreshLoading}
                className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-700 hover:text-blue-400 disabled:opacity-50"
                title="Refresh notifications"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
              >
                <FaTimes className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                  <span className="text-gray-400">
                    {notificationsLoading
                      ? "Loading notifications..."
                      : "Refreshing..."}
                  </span>
                </div>
              </div>
            ) : error ? (
              <div className="p-6 text-center">
                <FaInfoCircle className="mx-auto mb-2 h-8 w-8 text-red-400" />
                <p className="text-red-400">{error}</p>
                <button
                  onClick={handleRefresh}
                  className="mt-2 rounded-lg bg-red-600/20 px-3 py-1.5 text-sm text-red-400 hover:bg-red-600/30"
                >
                  Try Again
                </button>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-700/50">
                  <FaBell className="h-6 w-6 text-gray-500" />
                </div>
                <p className="text-gray-400">No notifications yet</p>
                <p className="mt-1 text-sm text-gray-500">
                  You'll see auction updates here
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-700/50">
                {notifications.map((notification, index) => (
                  <div
                    key={`${notification.id}-${index}`}
                    onClick={() => handleNotificationClick(notification)}
                    className={`group cursor-pointer p-4 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-900/30 hover:to-purple-900/30 ${
                      !notification.read
                        ? "border-l-2 border-blue-500 bg-blue-900/10"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon based on notification type */}
                      <div
                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                          notification.message.includes("won")
                            ? "bg-green-600/20 text-green-400"
                            : notification.message.includes("sold")
                              ? "bg-blue-600/20 text-blue-400"
                              : notification.message.includes("refund")
                                ? "bg-yellow-600/20 text-yellow-400"
                                : "bg-purple-600/20 text-purple-400"
                        }`}
                      >
                        {notification.message.includes("won") ? (
                          <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ) : notification.message.includes("sold") ? (
                          <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <FaInfoCircle className="h-4 w-4" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between">
                          <p
                            className={`text-sm leading-relaxed ${
                              !notification.read
                                ? "font-medium text-white"
                                : "text-gray-300"
                            }`}
                          >
                            {notification.message}
                          </p>
                          {!notification.read && (
                            <div className="ml-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500"></div>
                          )}
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(notification.time), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Arrow indicator */}
                      <div className="flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
                        <svg
                          className="h-4 w-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {notifications.length} notification
                  {notifications.length !== 1 ? "s" : ""}
                  {unreadCount > 0 && ` • ${unreadCount} unread`}
                </span>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      isConnected ? "bg-green-400" : "bg-red-400"
                    }`}
                  />
                  <span className="text-xs text-gray-500">
                    {isConnected ? "Live" : "Offline"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
