import { FaLock, FaCoins, FaWallet, FaPlus } from "react-icons/fa";
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
        className={`absolute top-0 right-0 h-full w-72 transform bg-gray-900 text-white shadow-xl transition-transform duration-300 ease-in-out ${
          isOpen ? "pointer-events-auto translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        <div className="flex h-full flex-col p-6">
          {/* User Info */}
          <div
            className="mb-4 flex cursor-pointer items-center space-x-4"
            onClick={() => {
              navigate("/profile");
              onClose();
            }}
          >
            <img
              src={profilePhoto}
              alt="Profile"
              className="h-12 w-12 rounded-full object-cover"
            />
            <span className="text-lg font-medium">
              {user?.fullName || "Guest"}
            </span>
          </div>

          <div className="-mt-8 mb-2 ml-16">
            <button
              className="cursor-pointer text-xs text-blue-400 hover:underline"
              onClick={() => {
                navigate("/profile");
                onClose();
              }}
            >
              View Profile
            </button>
          </div>
          <hr className="mb-4 border-gray-700" />

          {/* Wallet Section */}
          <div className="mb-4">
            <div className="rounded-xl border border-blue-500/20 bg-gradient-to-r from-blue-900/50 to-purple-900/50 p-3 shadow-sm">
              <div className="mb-3 flex items-center">
                <FaWallet className="mr-2 text-blue-400" />
                <span className="text-sm font-semibold text-blue-100">
                  Wallet
                </span>
              </div>

              {/* Coins */}
              <button
                className="mb-2 flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-all hover:bg-blue-800/30"
                onClick={() => {
                  navigate("/profile");
                  onClose();
                }}
              >
                <div className="flex items-center">
                  <FaCoins className="mr-2 text-yellow-400" />
                  <span className="text-sm">Coins</span>
                </div>
                <span className="font-semibold text-yellow-400">
                  {user?.coins}
                </span>
              </button>

              {/* Reserved Coins */}
              <button
                className="mb-3 flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-all hover:bg-blue-800/30"
                onClick={() => {
                  navigate("/profile");
                  onClose();
                }}
              >
                <div className="flex items-center">
                  <FaLock className="mr-2 text-xs text-gray-400" />
                  <span className="text-sm text-gray-300">Reserved</span>
                </div>
                <span className="text-sm font-semibold text-gray-300">
                  {user?.reservedCoins}
                </span>
              </button>

              {/* Buy Coins Button */}
              <button
                className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-blue-700 to-blue-500 px-3 py-2 text-sm font-medium text-white transition-all hover:from-green-500 hover:to-blue-500 hover:shadow-lg"
                onClick={() => {
                  navigate("/profile?buyCoins=true");
                  onClose();
                }}
              >
                <FaPlus className="mr-2 text-xs" />
                Buy Coins
              </button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mb-4 flex-1">
            <div className="rounded-xl bg-gray-800/80 p-3 shadow-sm">
              <button
                onClick={() => {
                  navigate("/profile/products");
                  onClose();
                }}
                className="mb-2 w-full rounded-lg px-4 py-2 text-left transition-all hover:bg-gray-700/80"
              >
                Products Purchased
              </button>
              <button
                onClick={() => {
                  navigate("/profile/products?tab=listed");
                  onClose();
                }}
                className="mb-2 w-full rounded-lg px-4 py-2 text-left transition-all hover:bg-gray-700/80"
              >
                Products Listed
              </button>
              <button
                onClick={() => {
                  navigate("/profile/products?tab=active");
                  onClose();
                }}
                className="mb-2 w-full rounded-lg px-4 py-2 text-left transition-all hover:bg-gray-700/80"
              >
                Active Bids
              </button>
              <button
                onClick={() => {
                  navigate("/profile/products?tab=wishlist");
                  onClose();
                }}
                className="w-full rounded-lg px-4 py-2 text-left transition-all hover:bg-gray-700/80"
              >
                Wishlist
              </button>
            </div>
          </div>

          <hr className="mb-4 border-gray-700" />

          {/* Actions */}
          <div className="space-y-2">
            <button
              className="w-full rounded px-4 py-2 text-left hover:bg-gray-800"
              onClick={() => {
                navigate("/profile?edit=1");
                onClose();
              }}
            >
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full rounded px-4 py-2 text-left hover:bg-gray-800 disabled:opacity-50"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
