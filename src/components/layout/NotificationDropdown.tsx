import React, { useState, useRef, useEffect, useCallback } from "react";
import { FaBell, FaTimes, FaInfoCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getNotifications, Notification } from "../../api/notificationApi";
import { formatDistanceToNow } from "date-fns";

const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false); // Track if dropdown was opened
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Use useCallback to memoize fetchNotifications to prevent unnecessary re-renders
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getNotifications();
      if (response.success) {
        // Add read property to notifications (default to false since backend doesn't provide it)
        const notificationsWithReadState = response.data.map(
          (notification) => ({
            ...notification,
            read: hasOpenedOnce, // If user has opened dropdown before, mark as read
          }),
        );
        setNotifications(notificationsWithReadState);
      } else {
        setError("Failed to load notifications");
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, [hasOpenedOnce]);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isOpen && notifications.length === 0) {
      fetchNotifications();
    }
  }, [isOpen, notifications.length, fetchNotifications]);

  // Mark all as read when dropdown opens for the first time
  useEffect(() => {
    if (isOpen && !hasOpenedOnce) {
      setHasOpenedOnce(true);
      // Mark all notifications as read when user opens dropdown
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true })),
      );
    }
  }, [isOpen, hasOpenedOnce]);

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

  const handleNotificationClick = (notification: Notification) => {
    // Navigate to product details page using productId
    navigate(`/product-details/${notification.productId}`);
    setIsOpen(false);
  };

  const handleRefresh = () => {
    fetchNotifications();
  };

  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
    // If opening for the first time, mark all as read
    if (!isOpen && !hasOpenedOnce) {
      setHasOpenedOnce(true);
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true })),
      );
    }
  };

  // Only show unread count if user hasn't opened dropdown yet
  const unreadCount = hasOpenedOnce
    ? 0
    : notifications.filter((n) => !n.read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={handleDropdownToggle}
        className="relative flex h-10 items-center justify-center rounded-lg bg-blue-500/10 px-3 text-blue-300 transition-all hover:bg-blue-500/20 hover:shadow-[0_0_8px_rgba(59,130,246,0.2)]"
      >
        <FaBell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 animate-pulse items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
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
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-700 hover:text-blue-400"
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
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                  <span className="text-gray-400">
                    Loading notifications...
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
                    key={`${notification.productId}-${notification.auctionId}-${index}`}
                    onClick={() => handleNotificationClick(notification)}
                    className="group cursor-pointer p-4 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-900/30 hover:to-purple-900/30"
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
                        <p className="text-sm leading-relaxed text-gray-300">
                          {notification.message}
                        </p>
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
                </span>
                <button
                  onClick={handleRefresh}
                  className="text-xs text-blue-400 transition-colors hover:text-blue-300"
                >
                  Refresh
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
