import { FaLock, FaCoins } from "react-icons/fa";
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
          <div className="mb-4 flex items-center space-x-4">
            <img
              src={profilePhoto}
              alt="Profile"
              className="h-12 w-12 rounded-full object-cover"
            />
            <span className="text-lg font-medium">
              {user?.fullName || "Guest"}
            </span>
          </div>

          <hr className="mb-4 border-gray-700" />

          {/* Stats Section */}
          <div className="mb-4 flex-1 space-y-2">
            <button className="w-full rounded px-4 py-2 text-left hover:bg-gray-800">
              Products Purchased
            </button>
            <button className="w-full rounded px-4 py-2 text-left hover:bg-gray-800">
              Products Listed
            </button>

            {/* Coins button with golden coin icon */}
            <button className="flex w-full items-center rounded px-4 py-2 text-left hover:bg-gray-800">
              <FaCoins className="mr-2 text-lg text-yellow-400" />
              <span className="font-medium">Coins:</span>
              <span className="ml-1 font-semibold">{user?.coins}</span>
            </button>

            {/* Reserved coins small, dull, lock as subscript */}
            <button className="flex w-full items-center rounded px-4 py-2 text-left hover:bg-gray-800">
              <FaLock className="mr-1 text-xs" />
              <span className="text-sm text-gray-400">Reserved Coins:</span>
              <span className="ml-1 text-sm font-semibold">
                {user?.reservedCoins}
              </span>
            </button>
          </div>

          <hr className="mb-4 border-gray-700" />

          {/* Actions */}
          <div className="space-y-2">
            <button className="w-full rounded px-4 py-2 text-left hover:bg-gray-800">
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
