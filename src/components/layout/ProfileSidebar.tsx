import {
  FaLock,
  FaCoins,
  FaWallet,
  FaPlus,
  FaShoppingBag,
  FaList,
  FaGavel,
  FaHeart,
  FaEdit,
  FaSignOutAlt,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { logout } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";
import profilePhoto from "../../assets/DP.png";
import { useState } from "react";
import { toast } from "react-toastify";
import { logoutUser } from "../../api/auth";
import { setAccessToken } from "../../api/axiosInstance";
import axios from "axios";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileSidebar({ isOpen, onClose }: SidebarProps) {
  const user = useSelector((s: RootState) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      // Call the logout API - this should invalidate the refresh token on the server
      await logoutUser()
        .then((res) => {
          if (res.success) {
            toast.success(res.message || "Logged out successfully");
          }
        })
        .catch((error) => {
          console.error("Logout API error:", error);
          // Continue with local logout even if API call fails
        })
        .finally(() => {
          // Always perform these actions regardless of API success/failure
          // Clear the access token
          setAccessToken(null);

          // Update Redux state
          dispatch(logout());

          // Close the sidebar
          onClose();

          // Navigate to login page
          navigate("/login");
        });
    } catch (error) {
      console.error("Logout error:", error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Logout failed");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {/* backdrop */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ease-in-out ${
          isOpen ? "pointer-events-auto opacity-50" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* sliding panel */}
      <div
        className={`absolute top-0 right-0 h-full w-80 transform bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "pointer-events-auto translate-x-0" : "translate-x-full"
        } flex flex-col border-l border-gray-600/30`}
      >
        {/* Make content scrollable */}
        <div className="flex h-full flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            {/* User Info */}
            <div
              className="mb-4 flex cursor-pointer items-center space-x-4 rounded-xl bg-gradient-to-r from-gray-800/60 to-gray-700/60 p-4 backdrop-blur-sm transition-all hover:from-gray-700/60 hover:to-gray-600/60"
              onClick={() => {
                navigate("/profile");
                onClose();
              }}
            >
              <img
                src={profilePhoto}
                alt="Profile"
                className="h-12 w-12 rounded-full border-2 border-blue-400/30 object-cover ring-2 ring-blue-500/20"
              />
              <div className="flex-1">
                <span className="block text-base font-semibold text-white">
                  {user?.fullName || "Guest"}
                </span>
                <span className="text-xs text-blue-400 hover:underline">
                  View Profile →
                </span>
              </div>
            </div>

            {/* Products Section - Blue gradient theme */}
            <div className="mb-4">
              <div className="rounded-xl border border-blue-500/20 bg-gradient-to-r from-blue-800/50 to-purple-1000/50 p-4 shadow-lg backdrop-blur-sm">
                <div className="mb-3 flex items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20">
                    <FaShoppingBag className="text-sm text-blue-300" />
                  </div>
                  <span className="ml-3 text-base font-semibold text-blue-100">
                    Products
                  </span>
                </div>

                <div className="space-y-1">
                  {/* Products Purchased */}
                  <button
                    onClick={() => {
                      navigate("/profile/products");
                      onClose();
                    }}
                    className="group flex w-full items-center rounded-lg px-3 py-2.5 text-left transition-all hover:bg-blue-800/30"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-green-500/20">
                      <FaShoppingBag className="text-xs text-green-400" />
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-200 group-hover:text-white">
                      Purchased
                    </span>
                  </button>

                  {/* Products Listed */}
                  <button
                    onClick={() => {
                      navigate("/profile/products?tab=listed");
                      onClose();
                    }}
                    className="group flex w-full items-center rounded-lg px-3 py-2.5 text-left transition-all hover:bg-blue-800/30"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-500/20">
                      <FaList className="text-xs text-blue-400" />
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-200 group-hover:text-white">
                      Listed
                    </span>
                  </button>

                  {/* Active Bids */}
                  <button
                    onClick={() => {
                      navigate("/profile/products?tab=active");
                      onClose();
                    }}
                    className="group flex w-full items-center rounded-lg px-3 py-2.5 text-left transition-all hover:bg-blue-800/30"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-orange-500/20">
                      <FaGavel className="text-xs text-orange-400" />
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-200 group-hover:text-white">
                      Active Bids
                    </span>
                  </button>

                  {/* Wishlist */}
                  <button
                    onClick={() => {
                      navigate("/profile/products?tab=wishlist");
                      onClose();
                    }}
                    className="group flex w-full items-center rounded-lg px-3 py-2.5 text-left transition-all hover:bg-blue-800/30"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-red-500/20">
                      <FaHeart className="text-xs text-red-400" />
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-200 group-hover:text-white">
                      Wishlist
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Wallet Section - Blue gradient theme */}
            <div className="mb-4">
              <div className="rounded-xl border border-blue-500/20 bg-gradient-to-r from-blue-700/50 to-purple-1000/50 p-4 shadow-lg backdrop-blur-sm">
                <div className="mb-3 flex items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20">
                    <FaWallet className="text-sm text-blue-300" />
                  </div>
                  <span className="ml-3 text-base font-semibold text-blue-100">
                    Wallet
                  </span>
                </div>

                <div className="space-y-1">
                  {/* Coins */}
                  <button
                    className="group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-all hover:bg-blue-800/30"
                    onClick={() => {
                      navigate("/profile");
                      onClose();
                    }}
                  >
                    <div className="flex items-center">
                      <div className="flex h-6 w-6 items-center justify-center rounded bg-yellow-500/20">
                        <FaCoins className="text-xs text-yellow-400" />
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-200 group-hover:text-white">
                        Available Coins
                      </span>
                    </div>
                    <span className="text-sm font-bold text-yellow-400">
                      {user?.coins?.toLocaleString() || "0"}
                    </span>
                  </button>

                  {/* Reserved Coins */}
                  <button
                    className="group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-all hover:bg-blue-800/30"
                    onClick={() => {
                      navigate("/profile");
                      onClose();
                    }}
                  >
                    <div className="flex items-center">
                      <div className="flex h-6 w-6 items-center justify-center rounded bg-gray-500/20">
                        <FaLock className="text-xs text-gray-400" />
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-300 group-hover:text-white">
                        Reserved
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-300">
                      {user?.reservedCoins?.toLocaleString() || "0"}
                    </span>
                  </button>
                </div>

                {/* Buy Coins Button */}
                <div className="mt-3 border-t border-blue-500/20 pt-3">
                  <button
                    className="group flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:from-blue-500 hover:to-purple-500 hover:shadow-xl"
                    onClick={() => {
                      navigate("/profile?buyCoins=true");
                      onClose();
                    }}
                  >
                    <FaPlus className="mr-2 text-xs transition-transform group-hover:scale-110" />
                    Buy Coins
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Actions - Fixed at bottom */}
          <div className="flex-shrink-0 border-t border-gray-700/50 p-4">
            <div className="space-y-2">
              <button
                className="group flex w-full items-center rounded-lg px-4 py-2.5 text-left transition-all hover:bg-gray-800/60"
                onClick={() => {
                  navigate("/profile?edit=1");
                  onClose();
                }}
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/20">
                  <FaEdit className="text-sm text-blue-400" />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-200 group-hover:text-white">
                  Edit Profile
                </span>
              </button>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="group flex w-full items-center rounded-lg px-4 py-2.5 text-left transition-all hover:bg-red-800/20 disabled:opacity-50"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/20">
                  <FaSignOutAlt className="text-sm text-red-400" />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-200 group-hover:text-red-300">
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
