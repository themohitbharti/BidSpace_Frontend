import { FaLock, FaCoins } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileSidebar({ isOpen, onClose }: SidebarProps) {
  const user = useSelector((s: RootState) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    onClose();
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
              src={"/default-avatar.png"}
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
              <span className="ml-1 font-semibold">
                {user?.coins}
              </span>
            </button>

            {/* Reserved coins small, dull, lock as subscript */}
            <button className="flex w-full items-center rounded px-4 py-2 text-left hover:bg-gray-800">
            
                <FaLock className="text-xs mr-1" />
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
              className="w-full rounded px-4 py-2 text-left hover:bg-gray-800"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
